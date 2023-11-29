const frequencyType = {
    'monthly': 1,
    'quartarly': 3,
    'half-yearly': 6,
    'annual': 11
};

function getContractDuration(startDate, endDate) {
    const startMonth = new Date(startDate).getMonth() + 1;
    const endMonth = new Date(endDate).getMonth() + 1;
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    return totalMonths;
}

const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}



const calculate = (data)=> {
    const frequencyMonths = frequencyType[data['frequency']];
    const contractDuration = getContractDuration(data.contractStartDate, data.contractEndDate);
    const totalInstallment = Math.ceil(contractDuration / frequencyMonths);
    const installmentAmounts = [];
    let firstmonthInvoice = 0;
    let lastmonthInvoice = 0;
    for(let i = 1; i <= totalInstallment; i++) {
        let installmentAmount = 0;
        if(i === 1) {
            const firstMonthDays = daysInMonth(new Date(data.contractStartDate).getMonth() + 1, new Date(data.contractStartDate).getFullYear());
            const firstMonthContractDays = firstMonthDays - new Date(data.contractStartDate).getDate() + 1;
            const firstMonthDiscount = (data.monthlyDiscount / firstMonthDays) * firstMonthContractDays;
            const firstMonthRent = ((data.rent/frequencyMonths)/firstMonthDays) * firstMonthContractDays;
            const firstMonthRentAfterDiscount = firstMonthRent - firstMonthDiscount;
            installmentAmount += firstMonthRentAfterDiscount;
            firstmonthInvoice = Math.round(firstMonthRentAfterDiscount);
        }
            
        if(i !== 1 && i !== totalInstallment) {
            installmentAmount += ((data.rent/frequencyMonths) - data.monthlyDiscount)*frequencyMonths;
        }
            
        if(i == 1 && i == totalInstallment && frequencyMonths > 2) {
            const monthlyRent = (data.rent/frequencyMonths) - data.monthlyDiscount;
            let monthsforcalculation = frequencyMonths - 2 > contractDuration -2 ? contractDuration - 2 : frequencyMonths - 2;
            installmentAmount += monthlyRent * monthsforcalculation;
        }
            
        if(i == 1 && i < totalInstallment && frequencyMonths > 1) {
            const monthlyRent = (data.rent/frequencyMonths) - data.monthlyDiscount;
            const totalRemainingMonths = frequencyMonths - 1;
            installmentAmount += monthlyRent * totalRemainingMonths;
        }
            
        if(i !== 1 && i == totalInstallment && frequencyMonths > 1){
            const monthlyRent = (data.rent/frequencyMonths) - data.monthlyDiscount;
            const totalRemainingMonths = frequencyMonths - 1;
            installmentAmount += monthlyRent * totalRemainingMonths;
        }

        if(i === totalInstallment) {
            const lastMonthDays = daysInMonth(new Date(data.contractEndDate).getMonth() + 1, new Date(data.contractEndDate).getFullYear());
            const lastMonthContractDays = new Date(data.contractEndDate).getDate();
            const lastMonthDiscount = (data.monthlyDiscount / lastMonthDays) * lastMonthContractDays;
            const lastMonthRent = ((data.rent/frequencyMonths)/lastMonthDays) * lastMonthContractDays;
            const lastMonthRentAfterDiscount = lastMonthRent - lastMonthDiscount;
            installmentAmount += lastMonthRentAfterDiscount;
            lastmonthInvoice = Math.round(lastMonthRentAfterDiscount);
        }
            
        installmentAmounts.push(Math.round(installmentAmount));
    }

    const monthlyInvoice = [firstmonthInvoice]

    for(let i = 2; i < contractDuration; i++) {
        monthlyInvoice.push(Math.round((data.rent/frequencyMonths) - data.monthlyDiscount));
    }
    monthlyInvoice.push(Math.round(lastmonthInvoice));
       return {
              installmentAmounts,
                monthlyInvoice,
       }     
}
    

// const result = calculate(data);


// const planfeq = document.getElementById('planfreq');

// for (let i = 0; i < Object.keys(frequencyType).length; i++) {
//     const option = document.createElement('option');
//     option.value = Object.keys(frequencyType)[i];
//     option.text = Object.keys(frequencyType)[i];
//     planfeq.appendChild(option);
// }

const form = document.getElementById('form');

const resultDiv = document.getElementById('result1');
const resultDiv2 = document.getElementById('result2');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());
    data.rent = parseInt(data.rent);
    data.monthlyDiscount = parseInt(data.monthlyDiscount);
    const result = calculate(data);

    resultDiv.innerHTML = '';
    result.installmentAmounts.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `Installment ${index + 1} : ${item}`;
        resultDiv.appendChild(div);
    });

    resultDiv2.innerHTML = '';
    result.monthlyInvoice.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `Month ${index + 1} : ${item}`;
        resultDiv2.appendChild(div);
    });
});