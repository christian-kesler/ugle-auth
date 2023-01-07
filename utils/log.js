module.exports = function (dtb, args, callback) {
    return new Promise((resolve) => {
        try {

            if (args === undefined || args === null || typeof args != 'object') {
                callback({
                    'message': `invalid args | args must be object, received '${args} ${typeof args}'`
                });
                resolve();
            } else if (args.action === undefined || args.action === null || typeof args.action != 'string') {
                callback({
                    'message': `invalid args.action | args.action must be string, received '${args.action} ${typeof args.action}'`
                });
                resolve();
            } else if (args.recipient === undefined || args.recipient === null || typeof Number(args.recipient) != 'number') {
                callback({
                    'message': `invalid args.recipient | args.recipient must be number, received '${Number(args.recipient)} ${typeof Number(args.recipient)}'`
                });
                resolve();
            } else if (args.data === undefined || args.data === null || typeof args.data != 'string') {
                callback({
                    'message': `invalid args.data | args.data must be string, received '${args.data} ${typeof args.data}'`
                });
                resolve();
            } else if (args.performed_by === undefined || args.performed_by === null || typeof Number(args.performed_by) != 'number') {
                callback({
                    'message': `invalid args.performed_by | args.performed_by must be number, received '${Number(args.performed_by)} ${typeof Number(args.performed_by)}'`
                });
                resolve();
            } else {

                dtb.run('INSERT INTO auth_log(action, recipient, data, performed_by, performed_at) VALUES(?,?,?,?,?);', [
                    args.action,
                    Number(args.recipient),
                    args.data,
                    Number(args.performed_by),
                    `${new Date}`,
                ], (err) => {
                    if (err) {
                        callback(err);
                        resolve();
                    } else {
                        callback(null);
                        resolve();
                    }
                });

            }

        } catch (err) {
            try {
                callback(err);
                resolve();
            } catch (err) {
                resolve();
            }
        }
    })
}