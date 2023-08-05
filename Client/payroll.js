const baseurl = 'http://localhost:4444';
// variable for the rows in my table
const tableBody = document.getElementById('tableBody')
// variables for add a new employee to payroll inputs
const employeeIdInput = document.getElementById('employeeId');
const hourlyWageInput = document.getElementById('hourlyWage');
const hoursWorkedInput = document.getElementById('hoursWorked');
const addEmployeeBtn = document.getElementById('payrollSubmit');


const tableRowCard = (row) => {
    let employeeData = document.createElement('tr')

    employeeData.innerHTML = `
        <th scope="row">${row.id}</th>
        <th>${row.employee_id}</th>
        <th id="editFirstName" onclick="editName(this,${row.employee_id})">${row.hourly_wage}</th>
        <th>${row.hours_worked}</th>
        <th>${row.timestamp}</th>
        <th>${row.gross_pay}<button onclick="deleteEmp(${row.employee_id})"><i class="bi bi-trash3-fill"></i></button></th>
        `

    tableBody.appendChild(employeeData)
}

// function to clear all rows incase manager makes an edit or deletes or adds a new employee
function clearEmployee() {
    tableBody.innerHTML="";
}

// function to get every employee on payout
let getPayroll = () => {
    clearEmployee();
    axios.get(`${baseurl}/pay`)
        .then(res => {
            console.log(res.data)
            let employee = res.data;
            for(let i=0;i<employee.length; i++) {
                tableRowCard(employee[i])
            }
        })
        .catch(err => console.error(err))
}


// function to be able to post/add a new employee
const addEmployeePayroll = (e) => {
    e.preventDefault();

    if(employeeIdInput && hourlyWageInput && hoursWorkedInput) {
        const body = {
            employeeId: employeeIdInput.value,
            hourlyWage: hourlyWageInput.value,
            hoursWorked: hoursWorkedInput.value
        };

        axios.post(`${baseurl}/newpayroll`, body)
            .then(res => {
                console.log(res.data)
                getPayroll()
            })
            .catch(err => console.error(err))
    }
    employeeIdInput.value = ''
    hourlyWageInput.value = ''
    hoursWorkedInput.value = ''
};



// functions that deletes a employee
const deleteEmp = (id) => {
    axios.delete(`${baseurl}/deletepayroll/${id}`)
    .then(res => {
        getPayroll();
        console.log(res.data)
        })
    .catch(err => console.error(err))
}


// function for onclick for the download pdf file
function getPDF() {
  var doc = new jsPDF();
  // We'll make our own renderer to skip this editor
  var specialElementHandlers = {
    '#getPDF': function(element, renderer){
      return true;
    },
    '.controls': function(element, renderer){
      return true;
    }
  };
 
  // All units are in the set measurement for the document
  // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
  doc.fromHTML($('.zima').get(0), 15, 15, {
    'width': 170,
    'elementHandlers': specialElementHandlers
  });
 
  doc.save('Generated.pdf');
}


// evenlistener for rows with employees on payroll to show
document.addEventListener('DOMContentLoaded', getPayroll);
// eventlistener for new row when user adds a employee to payroll
addEmployeeBtn.addEventListener('click', addEmployeePayroll);