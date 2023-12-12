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

const SERVER = 'http://localhost:8080';
const registerApi = `${SERVER}/signup`;


const handleUser = async () => {
    const data = {
        username:userNameInput.value,
        password:userPasswordInput .value,
        name:nameInput.value,
    }
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