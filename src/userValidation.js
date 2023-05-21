export function userValidation(userIsSignedIn, email = '') {

    const path = window.location.pathname

    if (!userIsSignedIn) {
        const isHome = path === '/'
        const isLogin =  path.includes('log-in')
        const isSingUp =  path.includes('sign-in')
        const header = document.querySelector('header-component')
        if(header) header.removeAttribute('logged')
        if (!isHome && !isLogin && !isSingUp){
            window.location.replace('/log-in/')
        }
    } else {
        const isLogin =  path.includes('log-in')
        const isSingUp =  path.includes('sign-in')
        if (isSingUp || isLogin){
            console.log('will redirect to home')
            window.location.replace('/')
        }
        const header = document.querySelector('header-component')
        console.log(header)
        if(header){
            header.setAttribute('logged', true)
            header.setAttribute('email', email)
        }
    }
}