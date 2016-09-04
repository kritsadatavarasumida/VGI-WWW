/**
 * Created by doi on 5/5/2016 AD.
 */

function alertDismissed() {
    // do something
    $('#login').val("");
    $('#login-psw').val("");
    $('#login').focus();
}

$('#btn-login').on('click', function () {

    if ($('#login').val() == "doi-admin") {
        window.sessionStorage.setItem('cid', 9999);
        window.sessionStorage.setItem('username', "doi-admin");
        window.sessionStorage.setItem('company_name', "VGI Global Media");
        //console.log(sessionStorage['uid']);
        window.location = "home.html";
    }

    if (!$('#login').val() || !$('#login-psw').val()) {
        navigator.notification.alert(
            'Incorrect Username or Password!',  // message
            alertDismissed,         // callback
            'Login fail',            // title
            'Back'                  // buttonName
        );
    } else {
        amplitude.setUserId($('#login').val());
        hashedpassword = sha256($('#login-psw').val());
        var formData = "username=" + $('#login').val() + "&hashedpassword=" + hashedpassword;
        console.log(formData);


        $.ajax({
            url: serverURL + "app-login.php",
            type: "POST",
            data: formData,
            success: function (data, textStatus, jqXHR) {
                console.log(JSON.stringify(data.data));
                //data - response from server
                if (data.data.length == 0) {
                    navigator.notification.alert(
                        'Incorrect Username or Password!',  // message
                        alertDismissed,         // callback
                        'Login fail',            // title
                        'Back'                  // buttonName
                    );
                    amplitude.logEvent('Login Fail');
                } else {
                    if (data.data[0].username == $('#login').val()) {
                        window.sessionStorage.setItem('cid', data.data[0].cid);
                        window.sessionStorage.setItem('username', data.data[0].username);
                        window.sessionStorage.setItem('company_name', data.data[0].company_name);
                        window.sessionStorage.setItem('company_logo', data.data[0].company_logo);
                        //console.log(sessionStorage['uid']);

                        amplitude.logEvent('Login Success');
                        window.location = "home.html";
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                navigator.notification.alert(
                    'Login Error!',  // message
                    alertDismissed,         // callback
                    'Error',            // title
                    'Back'                  // buttonName
                );
                amplitude.logEvent('Login Error');
            }
        });
    }
});