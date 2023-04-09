const token = localStorage.getItem("token")

export default {
    BASE_URL: "http://localhost:3003",
    /*BASE_URL : "https://flutter-stock-management.ew.r.appspot.com"*/
    HEADERS: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
}

