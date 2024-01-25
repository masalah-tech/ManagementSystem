var empDataTable;

$(document).ready(function () {
    populateUsersTable();
});

function populateUsersTable() {

    empDataTable = $('#tblData').DataTable(
        {
            ajax: {
                url: '/Employee/GetAll'
            },
            columns: [
                {
                    data: "name",
                    width: "20%"
                },
                {
                    data: "salary",
                    width: "20%"
                },
                {
                    data: "department.name",
                    width: "20%"
                },
                {
                    data: "id",
                    render: function (data) {

                        return `<div class="text-center">
                                    <a href="javascript:void(0)" class="btn btn-primary" onclick="showEditEmpModal('${data}')">Edit</a>
                                    <a href="javascript:void(0)" onclick="deleteEmp('${data}')" class="btn btn-danger text-white" style="cursor:pointer; width:150px;">
                                        <i class="bi bi-pencil-square"></i> Delete
                                    </a>
                                </div>`;
                    }
                },
            ]
        }
    );
}

function showEditEmpModal(empId) {
    $.ajax({
        url: `/Employee/Get?empId=${empId}`,
        success: function (res) {

            document.querySelector("#editempIdInput").value = res.data.id;
            document.querySelector("#editEmpNameInput").value = res.data.name;
            document.querySelector("#editEmpSalaryInput").value = res.data.salary;
            document.querySelector("#editEmpDepartmentInput").value = res.data.departmentId;

            $("#editEmpModal").modal("show");
        }
    });
}

function deleteEmp(empId) {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {


            $.ajax({
                url: `/Employee/Delete?empId=${empId}`,
                success: function (res) {

                    empDataTable.ajax.reload();

                    Swal.fire({
                        title: "Deleted!",
                        text: "The employee has been deleted.",
                        icon: "success"
                    });
                }
            });

            
        }
    });

    
}

function updateEmpData() {
    let empId = document.querySelector("#editempIdInput").value;
    let empName = document.querySelector("#editEmpNameInput").value;
    let empSalary = document.querySelector("#editEmpSalaryInput").value;
    let empDeptId = document.querySelector("#editEmpDepartmentInput").value;

    $.ajax({
        url: `/Employee/Edit?empId=${empId}&empName=${empName}&empSalary=${empSalary}&empDeptId=${empDeptId}`,
        success: function (res) {
            empDataTable.ajax.reload();
            $("#editEmpModal").modal("hide");
            toastr.success(res.message)
        }
    });

}

function addNewEmployee() {
    let empName = document.querySelector("#addEmployeeNameInput").value;
    let empSalary = document.querySelector("#addEmployeeSalaryInput").value;
    let empDeptId = document.querySelector("#addEmployeeDepartmentInput").value;

    $.ajax({
        url: `/Employee/AddNew?empName=${empName}&empSalary=${empSalary}&empDeptId=${empDeptId}`,
        success: function (res) {
            empDataTable.ajax.reload();
            $("#addEmployeeModal").modal("hide");
            toastr.success(res.message)
        }
    });

}

