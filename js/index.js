let map;
let currentPosition;
let selectedRestaurant;
let marker;
let directionsService;
let directionsRenderer;
let infoWindow;
let isDelete = false;
const mapContainer = document.querySelector('.map');
const searchInput = document.querySelector('.search_input');
const btn = document.querySelector('.btn');
const addBtn = document.querySelector('.addBtn');
const deleteBtn = document.querySelector('.delete_btn');
const restaurantList = document.querySelector('.restaurant_list');
const record_list = document.querySelector('.record_list');
const recordListWrap = document.querySelector('.record_list_wrap');
const restaurantListWrap = document.querySelector('.restaurant_list_wrap');
const drawWrap = document.querySelector('.draw_wrap');
const menu_1 = document.querySelector('.menu_1');
const menu_2 = document.querySelector('.menu_2');
const alertBox = document.querySelector('.alert_box');
const loginBtn = document.querySelector('.login_btn');
const logoutBtn = document.querySelector('.logout_btn');
const alertBg = document.querySelector('.alert_bg');
const body = document.querySelector('body');
const colors = ['rgb(66 184 131 / 1)','rgb(97 218 251 / 1)','#c73f5f','rgb(185, 174, 76)','rgb(163, 76, 185)'];
const uid = JSON.parse(localStorage.getItem('uid')) || [];
let user_restaurantListData = {};




// restaurantList init
let restaurantListData = JSON.parse(localStorage.getItem('restaurantListData')) || [];
// console.log(uid);
if(uid.id){
    logoutBtn.style.display = 'flex';
    loginBtn.style.display = 'none';
    user_restaurantListData = restaurantListData.filter((v) => {
        // console.log('v.id:',v.id," uid: ",uid);
        return v.id === uid.id;
    })

    // console.log("uid",user_restaurantListData);
    user_restaurantListData.forEach((restaurant) => {
    restaurantList.innerHTML +=
    `
        <li onclick="deleteConfirmAlert(this)" class="delete_li">
            <span style="font-size: 12px;">店名: </span><span class="add_bottomline">${restaurant.name}</span><span style="font-size: 12px;">地址: </span><span class="add_bottomline">${restaurant.address}</span>
            <div class="delete_btn">
                <img class="delete_img" src="/images/delete.png" alt="">
            </div>
        </li>
    `
    })
}else{
    let changeRestaurantListData = restaurantListData.filter((v) => {
        return !v.id;
    })
    restaurantListData = changeRestaurantListData;
    restaurantListData.forEach((restaurant) => {
    restaurantList.innerHTML +=
    `
        <li onclick="deleteConfirmAlert(this)" class="delete_li">
            <span style="font-size: 12px;">店名: </span><span class="add_bottomline">${restaurant.name}</span><span style="font-size: 12px;">地址: </span><span class="add_bottomline">${restaurant.address}</span>
            <div class="delete_btn">
                <img class="delete_img" src="/images/delete.png" alt="">
            </div>
        </li>
    `
    })
}

// 切換列表
const changeList = (number) => {
    if(number === 1){
        restaurantListWrap.style.display = 'none';
        recordListWrap.style.display = 'block';
        drawWrap.style.display = 'none';
        record_list.innerHTML = '';
        let recordData = JSON.parse(localStorage.getItem('record')) || [];
        if(uid.id){
            const userRecordData = recordData.filter((v) => {
                return v.uid === uid.id;
            })
            // console.log(recordData);
            if(recordData.length > 7){
                userRecordData.shift();
                recordData = userRecordData;
                localStorage.setItem('record',JSON.stringify(recordData));
                // console.log(recordData);
                for(let i = 0;i < recordData.length;i++){
                    record_list.innerHTML += `
                    <li class="record_li">${i+1}. 
                        <span class="record_add_bottomline">店名: ${recordData[i].record}</span>
                        <span class="record_add_bottomline">時間: ${recordData[i].time}</span>
                    </li>
                    `;
                }
            }else{
                recordData = userRecordData;
                for(let i = 0;i < recordData.length;i++){
                    record_list.innerHTML += `
                    <li class="record_li">${i+1}. 
                        <span class="record_add_bottomline">店名: ${recordData[i].record}</span>
                        <span class="record_add_bottomline">時間: ${recordData[i].time}</span>
                    </li>
                    `;
                }
            }
            
        }
    }else if(number === 2){
        recordListWrap.style.display = 'none';
        drawWrap.style.display = 'flex';
        restaurantListWrap.style.display = 'block';
    }
}

// 加入餐廳到最愛
addBtn.addEventListener('click',() => {
    restaurantList.innerHTML += 
    `
    <li onclick="deleteConfirmAlert(this)" class="delete_li">
        <span style="font-size: 12px;">店名: </span><span class="add_bottomline">${selectedRestaurant.name}</span><span style="font-size: 12px;">地址: </span><span class="add_bottomline">${selectedRestaurant.address}</span>
        <div class="delete_btn">
            <img class="delete_img" src="/images/delete.png" alt="">
        </div>
    </li>
    `
    // 加到最愛後清空輸入欄
    searchInput.value = '';

    const restaurantListData = JSON.parse(localStorage.getItem('restaurantListData')) || [];
    const color = colors[restaurantListData.length % 5];
    wheel.addSegment({
        fillStyle:color,
        text:selectedRestaurant.name,
        strokeStyle:'white'
    })
    if(uid.id){
        selectedRestaurant = {...selectedRestaurant,...uid};
        // console.log(selectedRestaurant);
    }
    wheel.draw();
    
    // console.log(selectedRestaurant);
    restaurantListData.push(selectedRestaurant);
    localStorage.setItem('restaurantListData',JSON.stringify(restaurantListData));
})

// 刪除選定的餐廳
const handleDelete = (e) => {
        if(e.children[1].classList.contains('add_bottomline')){
                e.remove();
        }
        const restaurantName = e.innerText.trim();
        // console.log(restaurantName);

        const restaurantListData = JSON.parse(localStorage.getItem('restaurantListData')) || [];
        const index = restaurantListData.findIndex((restaurant) => {
            return restaurant.name === restaurantName;
        })
        wheel.deleteSegment(index + 1);
        wheel.draw();
        const newRestaurantListData = restaurantListData.filter((restaurant) => {
            // console.log("店名: "+restaurant.name+"地址: "+ restaurant.address);
            if("店名: "+restaurant.name+"地址: "+ restaurant.address === restaurantName){
                return false;
            }else{
                return true;
            }
        })
        // console.log(isDelete);
        localStorage.setItem('restaurantListData',JSON.stringify(newRestaurantListData)); 
        isDelete = false;
}

// 確認刪除 Alert
const deleteConfirmAlert = (e) => {
    alertBox.style.display = 'flex';
    alertBg.style.display = 'block';
    body.style.overflowY = 'hidden';
    alertBox.innerHTML = `
            <div class="tips">溫馨提示</div>
            <div class="alert_txt">
                確定刪除 ?
            </div>
            <div style="display:flex;">
                <div class="alert_box_btn confirmBtn">確定</div>
                <div class="alert_box_btn" onclick="closeAlert()" style="background:#c3002f">取消</div>
            </div>
            `;
    const confirmBtn = document.querySelector('.confirmBtn');
    confirmBtn.addEventListener('click',() => {
        alertBox.style.display = 'none';
        alertBg.style.display = 'none';
        body.style.overflowY = 'auto';
        isDelete = true;
        handleDelete(e);
    })
}

const deleteConfirm = () => {
    alertBox.style.display = 'none';
    alertBg.style.display = 'none';
    body.style.overflowY = 'auto';
    isDelete = true;
}

function initMap(){
    map = new google.maps.Map(mapContainer,{
        center:{lat:23.553118,lng:121.0211024},
        zoom:7,
    });

    navigator.geolocation.getCurrentPosition((position) => {
        currentPosition = {
            lat:position.coords.latitude,
            lng:position.coords.longitude,
        };

        map.setCenter(currentPosition);
        map.setZoom(16);

        const autocomplete = new google.maps.places.Autocomplete(searchInput,{
            types:['restaurant'],
            bounds:{
                east:currentPosition.lng + 0.001,
                west:currentPosition.lng - 0.001,
                south:currentPosition.lat - 0.001,
                north:currentPosition.lat + 0.001,
            },
            strictBounds:false,
        });

        autocomplete.addListener('place_changed',() => {
            const place = autocomplete.getPlace();
            // console.log(place);

            selectedRestaurant = {
                location:place.geometry.location,
                placeId:place.place_id,
                name:place.name,
                address:place.formatted_address,
                phoneNumber:place.formatted_phone_number,
                rating:place.rating,
            }
            // console.log(selectedRestaurant);

            map.setCenter(selectedRestaurant.location);
            
            if(!marker){
                marker = new google.maps.Marker({
                    map:map,
                })
            }

            marker.setPosition(selectedRestaurant.location);

            if(!directionsService){
                directionsService = new google.maps.DirectionsService();
            }

            if(!directionsRenderer){
                directionsRenderer = new google.maps.DirectionsRenderer({
                    map:map,
                });
            }

            directionsRenderer.set('directions',null);

            directionsService.route({
                origin:new google.maps.LatLng(
                    currentPosition.lat,
                    currentPosition.lng,
                ),
                destination:{
                    placeId:selectedRestaurant.placeId,
                },
                travelMode:'WALKING',
            },(response,status) => {
                if(status === 'OK'){
                    directionsRenderer.setDirections(response);
                    if(!infoWindow){
                        infoWindow = new google.maps.InfoWindow();
                    }
                    // console.log(response);
                    infoWindow.setContent(
                        `
                        <h3>${selectedRestaurant.name}</h3>
                        <div>地址:${selectedRestaurant.address}</div>
                        <div>電話:${selectedRestaurant.phoneNumber}</div>
                        <div>評分:${selectedRestaurant.rating}</div>
                        <div>步行時間:${response.routes[0].legs[0].duration.text}</div>
                        `
                    );
                    infoWindow.open(map,marker);
                }
            })
        })
    })
}

const wheelData = uid.id ? user_restaurantListData : restaurantListData;
const wheel = new Winwheel({
    numSegments:wheelData.length,
    segments:wheelData.map((restaurant,index) => {
            // console.log(restaurant);
            return {
                fillStyle:colors[index % 4],
                text:restaurant.name,
                strokeStyle:'white',
            }
    }),
    pins:true,
    animation:{
        type:'spinToStop',
        spins:16,
        easing:'Power4.easeInOut',
        callbackFinished: (segment) => {
            document.querySelector('.wheel').style.display = 'none';
            document.getElementById('canvas').style.display = 'none';
            wheel.rotationAngle = 0;
            wheel.draw();
            // window.alert(segment.text);
            alertBox.style.display = 'flex';
            alertBg.style.display = 'block';
            body.style.overflowY = 'hidden';
            alertBox.innerHTML = `
            <div class="tips">溫馨提示</div>
            <div class="alert_txt">
                ${segment.text}
            </div>
            <div class="alert_box_btn" onclick="closeAlert()">確定</div>
            `;
            if(uid.id){
                const time = new Date();
                const year = time.getFullYear();
                const month = time.getMonth() + 1;
                const date = time.getDate();
                const hour = time.getHours();
                const minute = time.getMinutes() < 10 ? '0'+ time.getMinutes() : time.getMinutes();
                // console.log(minute);
                const userRecordData = JSON.parse(localStorage.getItem('record')) || [];
                const user_record = {
                    record:segment.text,
                    uid:uid.id,
                    time:`${year}/${month}/${date} - ${hour}:${minute}`
                }
                userRecordData.push(user_record);
                localStorage.setItem('record',JSON.stringify(userRecordData)); 
            }
            const restaurantList = JSON.parse(localStorage.getItem('restaurantListData')) || []
            selectedRestaurant = restaurantList.find((restaurant) => {
                return restaurant.name === segment.text
            })
            map.setCenter(selectedRestaurant.location);
            
            if(!marker){
                marker = new google.maps.Marker({
                    map:map,
                })
            }

            marker.setPosition(selectedRestaurant.location);

            if(!directionsService){
                directionsService = new google.maps.DirectionsService();
            }

            if(!directionsRenderer){
                directionsRenderer = new google.maps.DirectionsRenderer({
                    map:map,
                });
            }

            directionsRenderer.set('directions',null);

            directionsService.route({
                origin:new google.maps.LatLng(
                    currentPosition.lat,
                    currentPosition.lng,
                ),
                destination:{
                    placeId:selectedRestaurant.placeId,
                },
                travelMode:'WALKING',
            },(response,status) => {
                if(status === 'OK'){
                    directionsRenderer.setDirections(response);
                    if(!infoWindow){
                        infoWindow = new google.maps.InfoWindow();
                    }
                    // console.log(response);
                    infoWindow.setContent(
                        `
                        <h3>${selectedRestaurant.name}</h3>
                        <div>地址:${selectedRestaurant.address}</div>
                        <div>電話:${selectedRestaurant.phoneNumber}</div>
                        <div>評分:${selectedRestaurant.rating}</div>
                        <div>步行時間:${response.routes[0].legs[0].duration.text}</div>
                        `
                    );
                    infoWindow.open(map,marker);
                }
            })
        }
    }
})

document.querySelector('.draw').addEventListener('click',() => {
        if(wheel.segments.length >= 3){
            const canvas = document.getElementById('canvas');
            document.querySelector('.wheel').style.display = 'block';
            canvas.style.display = 'block';
            wheel.startAnimation();
        }
        else{
            alertBox.style.display = 'flex';
            alertBg.style.display = 'block';
            body.style.overflowY = 'hidden';
            alertBox.innerHTML = `
            <div class="tips">溫馨提示</div>
            <div class="alert_txt">
                請至少加入兩家餐廳哦哦哦哦 &hearts;
            </div>
            <div class="alert_box_btn" onclick="closeAlert()">確定</div>
            `;
        }
    })

// 跳轉登入頁
const jumpLoginPage = () => {
    const url = window.location.origin;
    window.location.href = url + '/pages/login.html';
    // console.log(url);
}

// 登出
const handleLogout = async () => {
    localStorage.removeItem('uid');
    const userListApi = 'http://localhost:3000/posts';
    await axios.get(userListApi)
    .then(function (response) {
        const userDbId = restaurantListData.filter((v) => {
            return v.id !== response.data.id;
        })
        restaurantListData = userDbId;
        localStorage.setItem('restaurantListData',JSON.stringify(restaurantListData));
    })
    .catch(function (error) {
        console.log(error);
    });
    
    // localStorage 全部清除
    // localStorage.clear()
    const url = window.location.origin;
    window.location.href = url;
}

// 關閉 Alert
const closeAlert = () => {
    alertBox.style.display = 'none';
    alertBg.style.display = 'none';
    body.style.overflowY = 'auto';
}