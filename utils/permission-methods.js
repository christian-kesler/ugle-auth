// isLoggedIn, hasPermission(str)




module.exports = {


    isLoggedIn: (session, res) => {
        try {

            if (session === undefined || session === null || typeof session != 'object') {
                res.redirect('/auth/login?msg=invalid-session')
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

                    if (session.perms[perm] != true) {
                        res.redirect('/account/home?msg=permission-denied')
                        return false
                    } else {
                        return true
                    }

                }

            }
        } catch (err) {
            try {
                res.redirect('/account/home?msg=permission-denied')
                return false
            } catch (err) {
                return false
            }
        }
    },


}