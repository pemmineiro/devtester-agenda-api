// Tudo que tiver no server tem que rodar
if (Meteor.isServer) {
    var Api = new Restivus({
        useDafaultAuth: false,
        prettyJson: true

    });

    Api.addRoute('users/:email', { authRequire: false }, {
        delete: function () {
            
            var user = Meteor.users.findOne({
                'emails.address': this.urlParams.email
            });

            if (user) {
                Meteor.users.remove(user._id);
                return {
                    message: 'ok'
                }
            } else {
                return {
                    statusCode: 404,
                    body: { message: 'nok' }
                }

            }
        }
    })

        Api.addRoute('users', { authRequire: false }, {
            get: function () {
                return {
                    statusCode: 200,
                    body: { message: 'API no ar...' }
                }
            },


            post: function () {
                var Future = require('fibres/future'); // como o javascript é assincrono, precisa utilizar esse código
                var future = new Future();              // para que ele espere a execução da variável response

                var body = this.request.body;

                var response;

                var user = {
                    email: body.email,
                    password: body.password,
                    profile: { name: body.name }
                }

                Meteor.call('saveAccount', user, function (err, res) {
                    if (err) {
                        future.return({
                            statusCode: 404,
                            body: { message: err.reason }
                        })

                    } else {
                        future.return({
                            statusCode: 200
                        });
                    }
                })

                return future.wait(response);
            }

        })

}