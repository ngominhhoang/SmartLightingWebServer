# Web Client SmartLighting

Web Client là ứng dụng web giúp người dùng dễ dàng tương tác điều khiển đèn thông minh trong hệ thống SmartLighting

### Công nghệ

Đang cập nhật..

### Cài đặt

Đang cập nhật..

### Lưu ý

#### Với giao diện tính năng bật tắt đèn:

Route: [http://{host}/light]

Để chỉnh sửa giao diện cho tính năng bật tắt đèn, sửa file <b>light.ejs</b>
```sh
.../views/light.ejs
```

Dòng từ 118 &rarr; 143. Đây là Popup Modal để điền giá trị độ sáng cho từng vị trí mong muốn. Ô nào để trống thì value = -1.
Tại nút Submit đã gán id cho nút để dùng JS bắt sự kiện onclick:
```sh
<button type="button" id="turnOnLight" class="btn btn-outline blue">Submit</button>
```

Dòng 220 &rarr; 252 là hàm JQuery bắt sự kiện onclick của button submit trên.
```sh
let i = 1;
let inputValue = [];
$("input[type='number']").each(() => {
    let n = $('#location'+i).val();
    if(n === ""){
        inputValue.push("-1");
    }
    else{
        inputValue.push(n);
    }
    i++;
})
```
Đây là code lấy dữ liệu từ ô Input và xử lí nếu ô input ko có giá trị, sau đó được push vào mảng <b>inputValue</b>
```sh
let s = JSON.stringify(inputValue);
$.ajax({
    type: "POST",
    url: "http://localhost:8080/turnOnLight",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: s,
    success: (msg) => {
        if(msg.success === true){
            alert('Bật đèn thành công');
        }
        else if(msg.success === false){
            alert(JSON.stringify(msg.reason));
        }
    },
    error: (XMLHttpRequest, textStatus, errorThrown) => {
        alert(textStatus + "     " + errorThrown);
    }
});
```

AJAX để xử lí post request. Array từ phía trên sẽ được stringfy rồi truyền về Web Server thông qua AJAX. Nếu truyền thành công thì chạy vô hàm:
```sh
success: (msg) => {
    if(msg.success === true){
        alert('Bật đèn thành công');
    }
    else if(msg.success === false){
        alert(JSON.stringify(msg.reason));
    }
},
```

Nếu kết quả trả từ Web Server là <b>true</b> từ câu lệnh sau bên phía Web Server:

```sh
res.json({
    success: true
    ....
})
```

Thì sẽ hiện Popup thông báo thành công. Ngược lại nếu <b> False </b> thì sẽ hiện thông báo lí do <b> False </b>

Nếu POST với AJAX bị lỗi, nó sẽ chạy vào hàm:
```sh
error: (XMLHttpRequest, textStatus, errorThrown) => {
    alert(textStatus + "     " + errorThrown);
}
```

Hàm này in thông báo lỗi khi request.

-------------------

#### Về phía Web Server

File chứa hàm xử lí bật tắt đèn, đồng thời cũng chờ để implement Controller:
```sh
.../controller/light.js
```

Hàm xử lí là hàm <b> turnOnLight </b> nằm ở cuối file. Ở file này đã cài đặt sẵn code nhận Data từ Array truyền từ AJAX POST phía trên.