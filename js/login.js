const userNameLabel = document.querySelector('.user_name_label');
const userPasswordLabel = document.querySelector('.user_password_label');
const nameLabel = document.querySelector('.name_label');
const userNameInput = document.querySelector('.username_input');
const userPasswordInput = document.querySelector('.user_password_input');
const nameInput = document.querySelector('.name_input');
const registerBtn = document.querySelector('.register_btn');
const loginBtn = document.querySelector('.login_btn');
const nameBox = document.querySelector('.name');
const title = document.querySelector('.title');
const alertBox = document.querySelector('.alert_box');
const alertBg = document.querySelector('.alert_bg');
const body = document.querySelector('body');
const SERVER = 'http://localhost:3000';
const registerApi = `${SERVER}/posts`;
let page = 0; // 預設 0 登入頁 1註冊頁
let pageTitle = 'Login';

title.innerHTML = pageTitle;

if(page === 1){
    registerBtn.style.display = 'none';
    loginBtn.style.display = 'block';
}
else if(page === 0){
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'block';
    nameBox.style.display = 'none';
}

const focusUserInput = (value) => {
    if(value === 'userName'){
        userNameLabel.style.top = '-50%';
        userNameLabel.style.fontSize = '12px';
        userNameLabel.style.color = 'rgb(66 184 131 / 1)';
    }
    else if(value === 'userPassword'){
        userPasswordLabel.style.top = '-50%';
        userPasswordLabel.style.fontSize = '12px';
        userPasswordLabel.style.color = 'rgb(66 184 131 / 1)';
    }
    else if(value === 'name'){
        nameLabel.style.top = '-50%';
        nameLabel.style.fontSize = '12px';
        nameLabel.style.color = 'rgb(66 184 131 / 1)';
    }
}

const blurUserInput = (value) => {
    if(value === 'userName' && userNameInput.value === ''){
        userNameLabel.style.top = '25%';
        userNameLabel.style.fontSize = '16px';
        userNameLabel.style.color = '#fff';
    }
    else if(value === 'userPassword' && userPasswordInput.value === ''){
        userPasswordLabel.style.top = '25%';
        userPasswordLabel.style.fontSize = '16px';
        userPasswordLabel.style.color = '#fff';
    }
    else if(value === 'name' && nameInput.value === ''){
        nameLabel.style.top = '25%';
        nameLabel.style.fontSize = '16px';
        nameLabel.style.color = '#fff';
    }
}

const changeRegister = (number) => {
    page = number;
    if(page === 1){
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        nameBox.style.display = 'block';
        pageTitle = 'Register';
        userNameInput.value = '';
        userPasswordInput .value = '';
        nameInput.value = '';
        blurUserInput('userName');
        blurUserInput('userPassword');
        blurUserInput('name');
    }
    else if(page === 0){
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'block';
        nameBox.style.display = 'none';
        pageTitle = 'Login';
        userNameInput.value = '';
        userPasswordInput .value = '';
        nameInput.value = '';
        blurUserInput('userName');
        blurUserInput('userPassword');
        blurUserInput('name');
    }
    title.innerHTML = pageTitle;
}

// 關閉 Alert
const closeAlert = () => {
    alertBox.style.display = 'none';
    alertBg.style.display = 'none';
    body.style.overflowY = 'auto';
}

const jumpHmoePage = (uid) => {
    const url = window.location.origin;
    window.location.href = url;
    // console.log(url);
    // console.log(uid);
    const user_id = {
        id: uid,
    }
    localStorage.setItem('uid',JSON.stringify(user_id)); 
}

const handelRegister = async(user_account,password,user_name) => {
    const data = {
        user_account:user_account,
        password:password,
        user_name:user_name,
    }

    JSON.stringify(data);

    await axios.post(registerApi, data, {})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    userNameInput.value = '';
    userPasswordInput .value = '';
    nameInput.value = '';
}

const handleUser = async () => {
    // 註冊
    const data = {
        user_account:userNameInput.value,
        password:userPasswordInput.value,
        user_name:nameInput.value,
    }

    if(title.innerHTML === 'Register'){
        if(data.user_account.length < 5 || data.password.length < 5 ){
            alertBox.style.display = 'flex';
            alertBg.style.display = 'block';
            body.style.overflowY = 'hidden';
            alertBox.innerHTML = `
                <div class="tips">溫馨提示</div>
                <div class="alert_txt">
                    帳號與密碼長度需大於5位
                </div>
                <div class="alert_box_btn" onclick="closeAlert()">確定</div>
                `;
        }else{
            alertBox.style.display = 'flex';
            alertBg.style.display = 'block';
            body.style.overflowY = 'hidden';
            alertBox.innerHTML = `
                <div class="tips">溫馨提示</div>
                <div class="alert_txt">
                    註冊成功
                </div>
                <div class="alert_box_btn" onclick="handelRegister(userNameInput.value,userPasswordInput.value,nameInput.value)">確定</div>
                `;
        }
    }

    // 登入
    else if(title.innerHTML === 'Login'){
        const data = {
            user_account:userNameInput.value,
            password:userPasswordInput .value,
        }
        JSON.stringify(data);
        await axios.get(registerApi)
        .then(function (response) {
            const loginUser = response.data.filter((v) => {
                    return v.user_account === data.user_account && v.password === data.password
            })
            // 跳轉首頁
            if(loginUser.length > 0){
                alertBox.style.display = 'flex';
                alertBg.style.display = 'block';
                body.style.overflowY = 'hidden';
                alertBox.innerHTML = `
                <div class="tips">溫馨提示</div>
                <div class="alert_txt">
                    登入成功
                </div>
                <div class="alert_box_btn" onclick="jumpHmoePage(${loginUser[0].id})">確定</div>
                `;
            }else{
                alertBox.style.display = 'flex';
                alertBg.style.display = 'block';
                body.style.overflowY = 'hidden';
                alertBox.innerHTML = `
                <div class="tips">溫馨提示</div>
                <div class="alert_txt">
                    帳號密碼輸入錯誤
                </div>
                <div class="alert_box_btn" onclick="closeAlert()">確定</div>
                `;
            }
            // console.log(loginUser);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}