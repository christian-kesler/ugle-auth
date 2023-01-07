// isLoggedIn, hasPermission(str)




module.exports = {


    isLoggedIn: (session, res) => {
        try {

            if (session === undefined || session === null || typeof session != 'object') {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } else if (res === undefined || res === null || typeof res != 'object') {
                console.error(`arg2 must be response object, received ${typeof res}`)
                return false
            } else {

                if (session.valid != true) {
                    res.redirect('/auth/login?msg=invalid-session')
                    return false
                } else {
                    return true
                }

            }
        } catch (err) {
            try {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } catch (err) {
                return false
            }
        }

    },


    hasPermission: (session, res, perm) => {
        try {

            if (session === undefined || session === null || typeof session != 'object') {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } else {

                if (session.valid != true) {
                    res.redirect('/auth/login?msg=invalid-session')
                    return false
                } else {

                    if (perm === undefined || perm === null || typeof perm != 'string') {
                        console.error(`invalid perm | perm must be string, received '${perm} ${typeof perm}'`)
                        res.redirect(`${login_redirect}?msg=permission-denied`)
                        return false
                    } else {

                        if (session.perms[perm] != true) {
                            res.redirect(`${login_redirect}?msg=permission-denied`)
                            return false
                        } else {
                            return true
                        }

                    }
                }

            }
        } catch (err) {
            try {
                res.redirect(`${login_redirect}?msg=permission-denied`)
                return false
            } catch (err) {
                return false
            }
        }
    },


}