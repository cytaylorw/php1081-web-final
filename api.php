<?php
    /* 
        [x] version(發行版本)
        [v] UID(唯一辨識碼)
        [v] title(活動名稱)
        [x] category(活動類別)
        [v] showUnit(演出單位)
        [v] descriptionFilterHtml(簡介說明)
        [v] discountInfo(折扣資訊)
        [v] imageUrl(圖片連結)
        [v] masterUnit(主辦單位)
        [x] subUnit(協辦單位)
        [x] supportUnit(贊助單位)
        [x] otherUnit(其他單位)
        [v] webSales(售票網址)
        [v] sourceWebPromote(推廣網址)
        [x] comment(備註)
        [v] editModifyDate(編輯時間)
        [x] sourceWebName(來源網站名稱)
        [v] startDate(活動起始日期)
        [v] endDate(活動結束日期)
        [x] hitRate(點閱數)
        [o] showInfo(活動場次資訊)
            [x] time(單場次演出時間)
            [v] location(地址)
            [v] locationName(場地名稱)
            [v] onSales(是否售票)
            [v] latitude(緯度)
            [v] longitude(經度)
            [v] price(售票說明)
            [x] endTime(結束時間)
    
    */
    $odataName = [
        ["title"],
        ["showUnit"],
        ["descriptionFilterHtml"],
        ["discountInfo"],
        ["imageUrl"],
        ["masterUnit"],
        ["webSales"],
        ["sourceWebPromote"],
        ["editModifyDate"],
        ["startDate"],
        ["endDate"],
        ["showInfo","location"],
        ["showInfo","locationName"],
        ["showInfo","onSales"],
        ["showInfo","latitude"],
        ["showInfo","longitude"],
        ["showInfo","price"],
    ];
    $cities= [
        1 => ["基隆市"],
        2 => ["臺北市","台北市",],
        3 => ["新北市"],
        4 => ["桃園市"],
        5 => ["新竹市"],
        6 => ["新竹縣"],
        7 => ["苗栗縣"],
        8 => ["臺中市","台中市",],
        9 => ["彰化縣"],
        10 => ["南投縣"],
        11 => ["雲林縣"],
        12 => ["嘉義市"],
        13 => ["嘉義縣"],
        14 => ["臺南市","台南市",],
        15 => ["高雄市"],
        16 => ["屏東縣"],
        17 => ["臺東縣","台東縣",],
        18 => ["花蓮縣"],
        19 => ["宜蘭縣"],
        20 => ["澎湖縣"],
        21 => ["金門縣"],
        22 => ["連江縣"],
    ];

    $data=[
        1 => [
            "name" => "基隆市",
            "count" => 0,
            "shows" => [],
        ],
        2 => [
            "name" => "臺北市",
            "count" => 0,
            "shows" => [],
        ],
        3 => [
            "name" => "新北市",
            "count" => 0,
            "shows" => [],
        ],
        4 => [
            "name" => "桃園市",
            "count" => 0,
            "shows" => [],
        ],
        5 => [
            "name" => "新竹市",
            "count" => 0,
            "shows" => [],
        ],
        6 => [
            "name" => "新竹縣",
            "count" => 0,
            "shows" => [],
        ],
        7 => [
            "name" => "苗栗縣",
            "count" => 0,
            "shows" => [],
        ],
        8 => [
            "name" => "臺中市",
            "count" => 0,
            "shows" => [],
        ],
        9 => [
            "name" => "彰化縣",
            "count" => 0,
            "shows" => [],
        ],
        10 => [
            "name" => "南投縣",
            "count" => 0,
            "shows" => [],
        ],
        11 => [
            "name" => "雲林縣",
            "count" => 0,
            "shows" => [],
        ],
        12 => [
            "name" => "嘉義市",
            "count" => 0,
            "shows" => [],
        ],
        13 => [
            "name" => "嘉義縣",
            "count" => 0,
            "shows" => [],
        ],
        14 => [
            "name" => "臺南市",
            "count" => 0,
            "shows" => [],
        ],
        15 => [
            "name" => "高雄市",
            "count" => 0,
            "shows" => [],
        ],
        16 => [
            "name" => "屏東縣",
            "count" => 0,
            "shows" => [],
        ],
        17 => [
            "name" => "臺東縣",
            "count" => 0,
            "shows" => [],
        ],
        18 => [
            "name" => "花蓮縣",
            "count" => 0,
            "shows" => [],
        ],
        19 => [
            "name" => "宜蘭縣",
            "count" => 0,
            "shows" => [],
        ],
        20 => [
            "name" => "澎湖縣",
            "count" => 0,
            "shows" => [],
        ],
        21 => [
            "name" => "金門縣",
            "count" => 0,
            "shows" => [],
        ],
        22 => [
            "name" => "連江縣",
            "count" => 0,
            "shows" => [],
        ],
        98 => [
            "name" => "其他",
            "count" => 0,
            "shows" => [],
        ],
        99 => [
            "name" => "未提供",
            "count" => 0,
            "shows" => [],
        ]
    ];

    $url="https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";
    $curl = curl_init();
    curl_setopt($curl,CURLOPT_USERAGENT,"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36");
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl,CURLOPT_URL,$url);
    $result=curl_exec($curl);
    curl_close($curl);
    $json = json_decode($result,true);
    // print_r($json);
    foreach($json as $jKey => $jValue){
        // echo $jValue["showInfo"][0]["onSales"]."<br>";
        // 依縣市分類
        $city="";
        if(empty($jValue["showInfo"][0]["location"])){
            $city=99;
        }else{            
            foreach($cities as $cKey => $cValues){
                foreach($cValues as $c){
                    if(strpos($jValue["showInfo"][0]["location"],$c) !== false){
                        $city=$cKey;
                        // echo $city." ".$jValue["showInfo"][0]["location"]."<br>";
                        break;
                    }
                }
            }
        }
        $city=(empty($city))?98:$city;
        $data[$city]["count"]++;
        foreach($odataName as $dValue){
            $tmp;
            foreach($dValue as $k => $d){
                if($k == 0){
                    $tmp=$jValue[$d];
                }else{
                    // print_r($tmp);
                    $tmp=$tmp[0][$d];
                }
            }
            $name=$dValue[count($dValue)-1];
            
            if($name == "descriptionFilterHtml" || $name == "discountInfo") {
                $tmp=str_replace("\r","<br>",str_replace("\\r\\n","<br>",str_replace("\r\n","<br>",$tmp)));
                if(!strpos($tmp,"<br />") && strpos($tmp,"br /")){
                    $tmp=str_replace("br /","<br>",$tmp);
                }
            }
            $data[$city]["shows"][$jValue["UID"]][$name]=$tmp;            
        }
        // print_r($data[$city]["shows"][$jValue["UID"]]);
        // 增加演出月份欄位
        $data[$city]["shows"][$jValue["UID"]]["months"]=[];
        // echo $jValue["startDate"]." - ".$jValue["endDate"]."<br>";
        $start=explode("/",$jValue["startDate"]);
        $end=explode("/",$jValue["endDate"]);
        if($start[0] < $end[0]){
            for($i=(int)$start[0];$i<=(int)$end[0];$i++){
                if($i<$end[0]){
                    for($j=(int)$start[1];$j<=12;$j++){
                        $data[$city]["shows"][$jValue["UID"]]["months"][$i][]=$j;
                    }
                }else{
                    for($j=1;$j<=(int)$end[1];$j++){
                        $data[$city]["shows"][$jValue["UID"]]["months"][$i][]=$j;
                    }
                }
            }
        }else{
            for($j=(int)$start[1];$j<=(int)$end[1];$j++){
                $data[$city]["shows"][$jValue["UID"]]["months"][$start[0]][]=$j;
            }
        }

    }
    // print_r($data);
    /* foreach($data as $k => $d){
        foreach($d["shows"] as $s){
            echo $k." ".$s["location"]."<br>";
        }
    } */
    // print_r($data["其他"]);
    // echo count($json);
    echo json_encode($data);
    
?>