const userNameLabel = document.querySelector('.user_name_label');
const userPasswordLabel = document.querySelector('.user_password_label');
const userNameInput = document.querySelector('.username_input');
const userPasswordInput = document.querySelector('.user_password_input');

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
}