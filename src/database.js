const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err))