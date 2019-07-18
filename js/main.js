let data;
let citySelect = $("#citySelect");
let monthSelect = $("#monthSelect");
let yearSelect = $("#yearSelect");
let saleSelect = $("#saleSelect");
let result = {};
let table;
let chart = $("#chart");
let myChart;
let chartConfig;
let gMap;
let gMarker;

$.get("api.php",function(res){
    datas=JSON.parse(res);
    // console.log(datas);
    let total=0;
    let chartGroup = {
        label: [
            "北基宜花金馬",
            "桃竹苗",
            "中彰投",
            "雲嘉南",
            "高屏澎東",
            "其他",
        ],
        city: [
            ["1","2","3","18","19","21","22"],
            ["4","5","6","7"],
            ["8","9","10"],
            ["11","12","13","14"],
            ["15","16","17","20"],
            ["98","99"]
        ],
        count: [0,0,0,0,0,0],
        color: [
            `hsl(0, 50%, 50%)`,
            `hsl(60, 50%, 50%)`,
            `hsl(120, 50%, 50%)`,
            `hsl(180, 50%, 50%)`,
            `hsl(240, 50%, 50%)`,
            `hsl(300, 50%, 50%)`],
    }

    Object.entries(datas).forEach(([key,val])=>{
        // 地圖
        $(`.map-city#c${key}, .other-city#c${key}`).each(function(){
            // console.log($(this));
            total+=val.count;
            $(this).attr({
                "data-toggle": "tooltip",
                "data-placement": "bottom",
                "data-html": "true",
                "data-code": key,
                title: `<h4>${val.name}</h4>展覽數量：${val.count}`
            });
            if($(this).attr("role"))$(this).attr("data-short",val.name[0]);
        })
        // 選單
        citySelect.append(`<option value="${key}">${val.name}(${val.count})</option>`);
        // 圖
        // console.log(chartGroup.city.length);
        for(let i=0;i<chartGroup.city.length;i++){
            if(chartGroup.city[i].includes(key)){
                chartGroup.count[i]+=val.count;
                break;
            }
        }
    });
    $("#total").text(total);

    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.global.defaultFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif, 'Microsoft JhengHei'";
    Chart.defaults.global.defaultFontSize = 16;
    chartConfig = {
        type: "bar",
        data: {
            labels: chartGroup.label,
            datasets:[
                {
                    data: chartGroup.count,
                    backgroundColor: chartGroup.color
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                text: `展覽統計(共${total})`,
                display: true,
                fontSize: 24,
            },
            legend: {
                display: false,
                position: "top",
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: true,
                        color: "#777777"
                    },
                }],
                yAxes: [{
                    display: true,
                        gridLines: {
                        display: true,
                        color: "#AAAAAA"
                    },
                }]
            }
        }
    };
        
    $("#loading p").text("網頁載入中")
    $("#loading").fadeOut(1000,function(){
            $("#nav").fadeIn();
            $("#content").fadeIn(function(){
                if($(".chart-wrap:visible").length != 0){
                    myChart = new Chart(chart,chartConfig);
                }
            });
            $("#footer").fadeIn();
            new WOW().init();
            $('[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip city" role="tooltip"><div class="arrow"></div><div class="tooltip-inner bg-color4"></div></div>'
            });
    })
})
particlesJS.load('night', './json/particlesjs-config.json', function() {
        // console.log('callback - particles.js config loaded');
});
$.ajax({
    url: "./svg/taiwan.svg",
    success: function(result){
        // console.log($(result).find("svg"));
        $("#map").append($(result).find("svg"));
    }
    
})

$('body').scrollspy({ target: '#nav' });

let d =new Date();
let year=d.getFullYear();
for(let i=year;i<=year+1;i++){
    yearSelect.append(`<option value="${i}">${i}</option>`);
}
yearSelect.find("option[value="+year+"]").prop("selected",true);
monthSelect.find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);


$(window).on('resize', function(){
    if($(".chart-wrap:visible").length != 0){
        if(myChart)myChart.destroy();
        myChart = new Chart(chart,chartConfig);
    }    
});

$(".map-wrap").on("click",".map-city, .other-city",function(){
    // console.log(citySelect.offset().top);
    citySelect.find("option[value="+$(this).data("code")+"]").prop("selected",true);
    $("html, body").animate({
        scrollTop: citySelect.offset().top-100
    },500)
});


$(".search-options select").on("change",function(){
    $("html, body").animate({
        scrollTop: $("#"+$(this).data("next")).offset().top-100
    },500);
    if($("#result").hasClass("d-flex"))$("#confirm").addClass("heartBeat animated slower infinite");
});

$("#confirm").on("click",function(){
    $("#confirm").removeClass("heartBeat animated slower infinite");
    if(table) table.destroy();
    $("#showTable tbody").empty();
    result = [];
    result.name = datas[citySelect.val()].name;
    result.shows = {};

    Object.entries(datas[citySelect.val()].shows).forEach(([key,val])=>{
        // console.log(val.months);
        // console.log(val.months[yearSelect.val()]);
        let sale = (val.onSales == "Y")?"1":"0";
        if((sale == saleSelect.val()) && val.months[yearSelect.val()] && val.months[yearSelect.val()].includes(parseInt(monthSelect.val()))){
            result.shows[key]=val;
            let unit = (val.masterUnit[0])?val.masterUnit[0]:((val.showUnit)?("演出單位："+val.showUnit):"未提供");
            $("#showTable tbody").append(/*html*/`
                <tr>
                    <td data-th="活動名稱">${val.title}</td>
                    <td data-th="主辦單位">${unit}</td>
                    <td data-th="起始日期">${val.startDate}</td>
                    <td data-th="結束日期">${val.endDate}</td>
                    <td data-th="介紹" >
                        <button type="button" class="btn btn-link btn-more no-decoration" data-id="${key}">
                            <i class="fas fa-eye flash animated slower infinite"></i> 詳細資料
                        </button>
                    </td>
                </tr>
            `)
        } 
    });
    // console.log(result);
    table=$("#showTable").DataTable({
        "language":{
            "url": "./json/datatables-chinese-traditional.json"
        },
        "columns": [
                {"width": "43%"},
                {"width": "23%"},
                {"width": "9%"},
                {"width": "9%"},
                {"width": "16%"},
        ],
        "columnDefs":[
            {
                "targets": 4,
                "orderable": false,
                "searchable": false
            }
        ]
    });

    $("#result").addClass("d-flex");
    $("html, body").animate({
        scrollTop: $("#result").offset().top-60
    },500);
});

$("#showTable").on("click",".btn-more",function(){
    let show = result.shows[$(this).data("id")];
    console.log(show);
    $("#modal .modal-title").text(show.title);
    $("#modal .modal-body").empty();
    
    if(show.imageUrl){
        $("#modal .modal-body").append(/*html*/`
            <div class="d-flex justify-content-center mb-3">
                <img src="${show.imageUrl}" class="mw-100 max-vh-25">
            </div>
        `);
    };

    let date = (show.startDate == show.endDate)?
        /*html*/`<li class="list-group-item flex-fill">${show.startDate}</li>`:
        /*html*/`
            <li class="list-group-item flex-fill text-center">${show.startDate}</li>
            <li class="list-group-item text-center">至</li>
            <li class="list-group-item flex-fill text-center">${show.endDate}</li>
        `;
    $("#modal .modal-body").append(/*html*/`
        <h6 class="font-italic">展覽期間</h6>
        <div class="container-fluid">
            <ul class="list-group list-group-horizontal-sm mb-2 flex-wrap">${date}</ul>
        </div>
    `);

    let sale = (show.webSales)?/*html*/`<a target="_blank" href="${show.webSales}" class="badge badge-danger text-100 mx-2">售票網址</a>`:"";
    let prices = "";
    if(show.onSales == "Y"){
        if(show.price){
            let type = show.price.split(";");
            type.forEach(el=>{
                let price = el.split("+");
                if(price[1] && !isNaN(price[1])){
                    prices += /*html*/`<li class="list-group-item flex-fill">${price[0]}
                        <span class="badge badge-info badge-pill">${price[1]}元</span>
                    </li>`;
                }else{
                    prices += (price[1])?
                        /*html*/`<li class="list-group-item flex-fill">${price[0]}+${price[1]}</li>`:
                        /*html*/`<li class="list-group-item flex-fill">${price[0]}</li>`;
                }
            });
        }else{
            prices += /*html*/`<li class="list-group-item flex-fill">未提供售價，請洽詢展覽單位</li>`;
        }
    }else if(show.onSales == "N"){
        prices += /*html*/`<li class="list-group-item flex-fill">免費參觀</li>`;
    }else{
        prices += /*html*/`<li class="list-group-item flex-fill">未提供售票資訊，請洽詢展覽單位</li>`;
    }
    prices = /*html*/`<ul class="list-group list-group-horizontal-sm mb-2 flex-wrap">${prices}</ul>`;
    let discount = (show.discountInfo)?/*html*/`
        <div class="row justify-content-center">
                <button type="button" class="btn btn-warning" data-toggle="popover" data-placement="bottom" 
                data-content="${show.discountInfo}">
                    折扣資訊
                </button>

        </div>
    `:"";
    $("#modal .modal-body").append(/*html*/`
        <h6 class="font-italic">售票資訊${sale}</h6>
        <div class="container-fluid sale-info">
            ${prices}
            ${discount}
        </div>
    `);
    if(discount) $('[data-toggle="popover"]').popover({
        html: true
    });

    let units = "";
    if(show.masterUnit[0]) units +=  /*html*/`<li class="list-group-item flex-fill">主辦單位：${show.masterUnit[0]}</li>`;
    if(show.showUnit && show.showUnit != show.masterUnit[0] 
            && !show.showUnit.includes(show.masterUnit[0]) && !units.includes(show.showUnit)) {
        units +=  /*html*/`<li class="list-group-item flex-fill">演出單位：${show.showUnit}</li>`;
    }
    if(units){
        units = /*html*/`<ul class="list-group list-group-horizontal-sm mb-2 flex-wrap">${units}</ul>`;
        $("#modal .modal-body").append(/*html*/`
            <h6 class="font-italic">展覽單位</h6>
            <div class="container-fluid unit-info">
                ${units}
            </div>
        `);
    }
    let location = "";
    if(show.locationName) location +=  /*html*/`<li class="list-group-item flex-fill">名稱：${show.locationName}</li>`;
    if(show.location) location +=  /*html*/`<li class="list-group-item flex-fill">地址：${show.location}</li>`;
    let lat = parseFloat(show.latitude);
    let lot = parseFloat(show.longitude);
    let map = "";
    let pos = {};
    if(!isNaN(lat) && !isNaN(lot) && lat!=0 && lot!=0 && lat>=-90 && lat<=90 && lot>=-180 && lot<=180){
        map = /*html*/`
        <div class='row justify-content-center'>
            <div class="col-12 my-1 text-center">
                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#gMap" aria-expanded="false" aria-controls="gMap">
                    地圖
                </button> 
            </div>
            <div class='col-11 mx-auto mb-2 collapse' id='gMap'></div>
        </div>`;
        pos = {lat: lat, lng: lot};
    }
    if(location){
        location = /*html*/`<ul class="list-group list-group-horizontal-sm mb-2 flex-wrap">${location}</ul>`;
        $("#modal .modal-body").append(/*html*/`
            <h6 class="font-italic">展覽地點</h6>
            <div class="container-fluid unit-info">
                ${location}
                ${map}
            </div>
        `);
    }

    if($("#gMap").length){
        gMap = new google.maps.Map(document.getElementById('gMap'), {
            center: pos,
            zoom: 15
        });
        gMarker = new google.maps.Marker({
            position: pos,
            map: gMap,
            title: show.locationName
          });
    }


    let link = (show.sourceWebPromote)?`<a target="_blank" href="${show.sourceWebPromote}" class="badge badge-success text-100 mx-2">活動網址</a>`:"";
    let intro = (show.descriptionFilterHtml)?/*html*/`
        <div class="container-fluid more-intro">
        <div class="card show-intro m-auto">
            <div class="card-body">
                <p class="card-text">${show.descriptionFilterHtml}</p>
            </div>
        </div>
        </div>
    `:"";
    if(link || intro){
        $("#modal .modal-body").append(/*html*/`
            <h6 class="font-italic">展覽介紹${link}</h6>
            ${intro}
        `);
    }
    
    $("#modal").modal("show");
})