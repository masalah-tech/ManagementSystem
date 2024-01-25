var empDataTable;

$(document).ready(function () {
    populateUsersTable();
});

function populateUsersTable() {

    empDataTable = $('#tblData').DataTable(
        {
            ajax: {
                url: '/Department/GetAll'
            },
            columns: [
                {
                    data: "name",
                    width: "60%"
                },
                {
                    data: "id",
                    render: function (data) {

                        return `<div class="text-center">
                                    <a href="javascript:void(0)" class="btn btn-primary" onclick="showEditDeptModal('${data}')">Edit</a>
                                    <a href="javascript:void(0)" onclick="deleteDept('${data}')" class="btn btn-danger text-white" style="cursor:pointer; width:150px;">
                                        <i class="bi bi-pencil-square"></i> Delete
                                    </a>
                                </div>`;
                    }
                },
            ]
        }
    );
}

function showEditDeptModal(deptId) {
    $.ajax({
        url: `/Department/Get?deptId=${deptId}`,
        success: function (res) {

            console.log(res.data.role)

            document.querySelector("#editDeptIdInput").value = res.data.id;
            document.querySelector("#editDepartmentNameInput").value = res.data.name;
            $("#editDepartmentModal").modal("show");
        }
    });
}

function deleteDept(deptId) {
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
                url: `/Department/Delete?deptId=${deptId}`,
                success: function (res) {
                console.log(res)

                    empDataTable.ajax.reload();

                    Swal.fire({
                        title: "Deleted!",
                        text: "The user has been deleted.",
                        icon: "success"
                    });
                }
            });

            
        }
    });

    
}

function updateDepartmentData() {
    let deptId = document.querySelector("#editDeptIdInput").value;
    let name = document.querySelector("#editDepartmentNameInput").value;

    $.ajax({
        url: `/Department/Edit?deptId=${deptId}&name=${name}`,
        success: function (res) {
            empDataTable.ajax.reload();
            $("#editDepartmentModal").modal("hide");
            toastr.success(res.message)
        }
    });

}

function addNewDepartment() {
    let deptName = document.querySelector("#addDepartmentNameInput").value;

    $.ajax({
        url: `/Department/AddNew?deptName=${deptName}`,
        success: function (res) {
            empDataTable.ajax.reload();
            $("#addDepartmentModal").modal("hide");
            toastr.success(res.message)
        }
    });

}

