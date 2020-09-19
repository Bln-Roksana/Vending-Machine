const coinSchema= {
  name: String,
  diameter: Number,
  thickness: Number,
  weight: Number,
  value: Number
};
const Coin = mongoose.model('coin', coinSchema)

exports.saveCoins=function(){
  // console.log(mongoose.models());
  // if (! coinModelAlreadyDeclared())
  // const onePenny= new Coin({
  //   name: "Penny",
  //   diameter: 19.05,
  //   thickness: 1.52,
  //   weight: 2.5,
  //   value: 0.01
  // });
  const fiveNickel= new Coin({
    name: "Nickel",
    diameter: 21.21,
    thickness: 1.95,
    weight: 5,
    value: 0.05
  });
  const tenDime= new Coin({
    name: "Dime",
    diameter: 17.91,
    thickness: 1.35,
    weight: 2.268,
    value: 0.10
  });
  const tfQuarter= new Coin({
    name: "Quarter",
    diameter: 24.26,
    thickness: 1.75,
    weight: 5.670,
    value: 0.25
  });

  const standardUsCoins=[fiveNickel, tenDime, tfQuarter];


  Coin.find({}, function (err, foundCoins){
    if(foundCoins.length===0){
      Coin.insertMany(standardUsCoins, function(err){
        if(!err){
          console.log("Array of coins was inserted successfully");
        }
      })
    }
  })
  //const Coin=mongoose.model("coin", coinSchema);


};


// function coinModelAlreadyDeclared() {
//   try {
//     mongoose.model('coin')  // it throws an error if the model is still not defined
//     return true
//   } catch (e) {
//     console.log(e);
//     return false
//   }
// };
//
const productSchema={
  name: String,
  price: Number,
  stock: {
    type:Number,
    min:0 }
};

const Product= mongoose.model("product", productSchema);

exports.saveProducts=async function(callback){


  const coke= new Product({
    name: "coke",
    price: 1.00,
    stock: 2
  });
  const chips= new Product({
    name: "chips",
    price: 0.50,
    stock: 4
  });
  const candy= new Product({
    name: "candy",
    price: 0.65,
    stock: 5
  });

  const productArray=[coke, chips, candy];

  exports.products=productArray;

  // await Product.find({}, function (err, foundProducts){
  //   if(foundProducts.length===0){
  //     Product.insertMany(productArray, function(err){
  //       if(!err){
  //         console.log("Array of products was inserted successfully");
  //         callback();
  //       }
  //     })
  //   }
  // })

  /**
  * return a promise that can be awaited by app.js
  * .exec with .then function only returns a data param not an error param
  * to do something on error use .catch after the .then
  */
  return Product.find({}).exec() //.exec needed to return a promise
    .then(function(data) { // when .find promise completes start a new promise
      // console.log("data", data);
      if(data.length !== 0) return // complete promise if there is data. nothing to insert

      //return a the promise of .insertMany if we need to insert data so we can wait for this to finish
      return Product.insertMany(productArray) // already returns a promise without .exec https://mongoosejs.com/docs/api.html#model_Model.insertMany
        .then(function(data) { // when .insertMany promise completes start a new promise
          if(data){
            console.log("Array of products was inserted successfully");
          }
          // promise auto comples here because function finishes and we return nothing.
        })
    })
    .catch(function(err) {
      console.log("err", err);
    })
};

exports.MatchCoin=async function(diameter, thickness, weight){

  return Coin.findOne({diameter: diameter, thickness: thickness, weight: weight }).exec();

};

exports.MatchProduct=async function(chosenItem){
  // go to the record and update the stock

  return Product.findOneAndUpdate({name: chosenItem},{$inc: {stock: -1}}
  //foundData.save();
  );

};

exports.GetAllProducts=async function(){

  return Product.find({}, function(err){
    if(err){
      console.log(err);
    }
  });
};



// exports.GetPrice=async function(chosenItem){
//   return Product.findOne({name: chosenItem},function(err, foundData){
//     if(err){
//       console.log(err);
//     }
//   });
// }

// exports.MatchCoin=function(diameter, thickness, weight, callback){
//    Coin.find({diameter: diameter, thickness: thickness, weight: weight },function(err, foundCoin){
//
//     if(!err && foundCoin.length>0){
//       callback(foundCoin[0].value);
//
//     }else{
//       callback(null, "invalid coin");
//     }
//
//   });
// }
