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
const alertBox = document.querySelector('.alert_box');
const colors = ['rgb(66 184 131 / 1)','rgb(97 218 251 / 1)','rgb(66 184 131 / 1)','rgb(97 218 251 / 1)'];






// restaurantList init
const restaurantListData = JSON.parse(localStorage.getItem('restaurantListData')) || [];
restaurantListData.forEach((restaurant) => {
    restaurantList.innerHTML +=
    `
        <li onclick="deleteConfirmAlert(this)" class="delete_li">
            <span style="font-size: 14px;">店名: </span><span class="add_bottomline">${restaurant.name}</span><span style="font-size: 14px;">地址: </span><span class="add_bottomline">${restaurant.address}</span>
            <div class="delete_btn">
                <img class="delete_img" src="/images/delete.png" alt="">
            </div>
        </li>
    `
})

// 加入餐廳到最愛
addBtn.addEventListener('click',() => {
    restaurantList.innerHTML += 
    `
    <li onclick="deleteConfirmAlert(this)" class="delete_li">
        <span style="font-size: 14px;">店名: </span><span class="add_bottomline">${selectedRestaurant.name}</span><span style="font-size: 14px;">地址: </span><span class="add_bottomline">${selectedRestaurant.address}</span>
        <div class="delete_btn">
            <img class="delete_img" src="/images/delete.png" alt="">
        </div>
    </li>
    `
    // 加到最愛後清空輸入欄
    searchInput.value = '';

    const restaurantListData = JSON.parse(localStorage.getItem('restaurantListData')) || [];
    const color = colors[restaurantListData.length % 4];
    wheel.addSegment({
        fillStyle:color,
        text:selectedRestaurant.name,
        strokeStyle:'white'
    })
    wheel.draw();
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
        // localStorage.setItem('restaurantListData',JSON.stringify(newRestaurantListData)); 
        isDelete = false;
}

// 確認刪除 Alert
const deleteConfirmAlert = (e) => {
    alertBox.style.display = 'flex';
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
        isDelete = true;
        handleDelete(e);
    })
}

const deleteConfirm = () => {
    alertBox.style.display = 'none';
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

const wheel = new Winwheel({
    numSegments:restaurantListData.length,
    segments:restaurantListData.map((restaurant,index) => {
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
            alertBox.innerHTML = `
            <div class="tips">溫馨提示</div>
            <div class="alert_txt">
                ${segment.text}
            </div>
            <div class="alert_box_btn" onclick="closeAlert()">確定</div>
            `;
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

if(wheel.segments.length > 1){
    document.querySelector('.draw').addEventListener('click',() => {
        const canvas = document.getElementById('canvas');
        document.querySelector('.wheel').style.display = 'block';
        canvas.style.display = 'block';
        wheel.startAnimation();
    })
}


// 跳轉登入頁
const jumpLoginPage = () => {
    const url = window.location.origin;
    window.location.href = url + '/pages/login.html';
    // console.log(url);
}

// 關閉 Alert
const closeAlert = () => {
    alertBox.style.display = 'none';
}

