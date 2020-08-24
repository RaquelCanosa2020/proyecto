import jwt from 'jwt-decode'
import axios from 'axios'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Swal from "sweetalert2";




export async function login(email, password) {

    const response = await axios.post("http://localhost:3000/beach/users/login", {
        email: email,
        password: password
    })

    console.log(response)

    //GUARDO EL TOKEN
    setAuthToken(response.data.data.token)
    //GUARDO EL ROL

    const tokenDecoded = jwt(response.data.data.token)
    localStorage.setItem('ROLE', tokenDecoded.role)
    console.log(tokenDecoded.role)

    //GUARDO EL ID
    localStorage.setItem('ID', tokenDecoded.id)
    console.log(tokenDecoded.id)

};



//FUNCIÓN PARA GUARDAR EN LOCALSTORAGE EL JSONWEBTOKEN

export function setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('AUTH_TOKEN_KEY', token)

}

//FUNCIÓN PARA CONSEGUIR EL TOKEN DEL USUARIO GUARDADA EN LOCALSTORAGE

export function getAuthToken() {
    return localStorage.getItem('AUTH_TOKEN_KEY')
}

//FUNCIÓN PARA CONSEGUIR LA FECHA DE CADUCIDAD DEL TOKEN

export function tokenExpiration(encodedToken) {
    let token = jwt(encodedToken)
    if (!token.exp) {
        return null
    }
    let date = new Date(0)
    date.setUTCSeconds(token.exp)
    return date
}

//FUNCIÓN QUE COMPRUEBA SI EL TOKEN ESTÁ VIGENTE O NO

export function isExpired(token) {
    let expirationDate = tokenExpiration(token)
    return expirationDate < new Date()
}

//FUNCIÓN QUE COMPRUEBA SI LA PERSONA ESTÁ LOGUEADA Y EL TOKEN ES VÁLIDO

export function isLoggedIn() {
    let authToken = getAuthToken()
    return !!authToken && !isExpired(authToken)
}

//FUNCIÓN PARA GUARDAR ADMIN EN LOCALSTORAGE
export function setIsAdmin(admin) {
    localStorage.setItem('ROLE', admin)

}

//FUNCIÓN PARA RECUPERAR EL ADMIN DE LOCALSTORAGE

export function getIsAdmin() {
    return localStorage.getItem('ROLE')
}



//FUNCIÓN PARA COMPROBAR SI ES ADMIN O NO

export function checkIsAdmin() {
    let role = null
    let admin = getIsAdmin()
    if (admin === 'admin') {
        role = true
    } else {
        role = false
    }
    return role
}

//FUNCIÓN DE GUARDAR EL NOMBRE DEL USUARIO EN LOCALSTORAGE

export function setName(user) {

    localStorage.setItem('NAME', user)
}

//FUNCIÓN PARA RECUPERAR EL NOMBRE DEL USUARIO DE LOCALSTORAGE

/*export function getName() {
    return localStorage.getItem('NAME')
}*/

//FUNCIÓN PARA RECUPERAR EL ID DEL USUARIO DE LOCALSTORAGE
export function getId() {
    return localStorage.getItem('ID')
}


//FUNCIÓN PARA LOGOUT
export function logout() {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('AUTH_TOKEN_KEY')
    localStorage.removeItem('ROLE')
    localStorage.removeItem('ID')
}

//FUNCIÓN PARA CAMBIAR INFO DE SERVICIOS
export function setServices(service) {
    if (service === 1) { return "Sí" }
    else { return "No" }

}
//FUNCIÓN PARA DAR FORMATO AMIGABLE A LAS FECHAS QUE VE EL USUARIO
export function formatDateToUser(date) {
    let dateToUser = `${format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: es
    })} a las ${format(new Date(date), "p")} horas`;
    return dateToUser;
}


//ALERTA CUANDO LOS DATOS SON INCORRECTOS

export function sweetAlertNotice(msg) {
    Swal.fire({
        title: "AVISO",
        text: msg,
        icon: "warning",
        buttonsStyling: false,
        confirmButtonText: "OK",
    });
}

export function sweetAlertOk(msg) {
    Swal.fire({
        title: "OK",
        text: msg,
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "OK",
    });
}


//Confirmación de borrado de registros:
export function sweetAlertErase() {
    Swal.fire({
        title: "Confirma la acción",
        text: "Confirma la eliminación de este registro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmado",
    }).then((result) => {
        if (result.value) {
            Swal.fire("Registro eliminado");


        }
    });
}

