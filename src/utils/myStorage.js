export function localGet (key) {
    const value = window.localStorage.getItem(key)
    try {
        return JSON.parse(window.localStorage.getItem(key))
    } catch (error) {
        return value
    }
}

export function localSet (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove (key) {
    window.localStorage.removeItem(key)
}

export function sessionGet (key) {
    const value = window.sessionStorage.getItem(key)
    try {
        return JSON.parse(window.sessionStorage.getItem(key))
    } catch (error) {
        return value
    }
}

export function sessionSet (key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
}

export function sessionRemove (key) {
    window.sessionStorage.removeItem(key)
}