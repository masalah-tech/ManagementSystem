var dataTable;

$(document).ready(function () {
    populateUsersTable();
});

function populateUsersTable() {

    dataTable = $('#tblData').DataTable(
        {
            ajax: {
                url: '/User/GetAll'
            },
            columns: [
                {
                    data: "user.userName",
                    width: "20%"
                },
                {
                    data: "user.email",
                    width: "20%"
                },
                {
                    data: "roles[0]",
                    width: "20%"
                },
                {
                    data: {
                        id: "user.id",
                        lockoutEnd: "lockoutEnd"
                    },
                    render: function (data) {

                        return `<div class="text-center">
                                    <a href="javascript:void(0)" class="btn btn-primary" onclick="showEditUserModal('${data.user.id}')">Edit</a>
                                    <a href="javascript:void(0)" onclick="deleteUser('${data.user.id}')" class="btn btn-danger text-white" style="cursor:pointer; width:150px;">
                                        <i class="bi bi-pencil-square"></i> Delete
                                    </a>
                                </div>`;
                    }
                },
            ]
        }
    );
}

function showEditUserModal(userId) {
    $.ajax({
        url: `/User/Get?userId=${userId}`,
        success: function (res) {

            console.log(res.data.role)

            document.querySelector("#editUserIdInput").value = res.data.user.id;
            document.querySelector("#editUsernameInput").value = res.data.user.userName;
            document.querySelector("#editUserEmailInput").value = res.data.user.email;
            document.querySelector("#editUserRoleInput").value = res.data.role;
            $("#editUserModal").modal("show");
        }
    });
}

function deleteUser(userId) {

    console.log(userId);

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
                url: `/User/Delete?userId=${userId}`,
                success: function (res) {
                console.log(res)

                    dataTable.ajax.reload();

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

function updateUserData() {
    let userId = document.querySelector("#editUserIdInput").value;
    let username = document.querySelector("#editUsernameInput").value;
    let userEmail = document.querySelector("#editUserEmailInput").value;
    let role = document.querySelector("#editUserRoleInput").value;

    $.ajax({
        url: `/User/UpdateUser?userId=${userId}&username=${username}&userEmail=${userEmail}&role=${role}`,
        success: function (res) {
            dataTable.ajax.reload();
            $("#editUserModal").modal("hide");
            toastr.success(res.message)
        }
    });

}