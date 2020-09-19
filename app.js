mongoose=require("mongoose");
express=require("express");
ejs= require("ejs");
bodyParser=require("body-parser");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/coinsDB");

//databases.js
const dbs=require(__dirname+"/databases.js");

let totalCoinsInserted=0;

app.get("/",async function(req,res){
  let chosenItem=req.query.item;
  if(chosenItem===undefined){
    console.log("chosenItem===undefined I am here");
    const coinInserted=0;
    // if (coinInserted===undefined){
    //   coinInserted=0
    // }

    dbs.saveCoins();
    await dbs.saveProducts();
    let allProductsInfo= await dbs.GetAllProducts();
    console.log("allProductsInfo: ",allProductsInfo);


    res.render("welcome",{
      pCoke: allProductsInfo[0],
      pChips: allProductsInfo[1],
      pCandy: allProductsInfo[2]
    });
  }else{

    let chosenItem=req.query.item;

    // const cokeStock=matchedItemDocument.find(function(product){
    //   product.name=="coke"
    // });

    //get price of item chosen, update stock
    let matchedItemDocuments= await dbs.MatchProduct(chosenItem);//but passing the bought one
    let matchedPrice=matchedItemDocuments.price;
    let changeDue=totalCoinsInserted-matchedPrice;
    totalCoinsInserted=0;

    let allProductsInfo= await dbs.GetAllProducts();

    res.render("thankyou",{
      pCoke: allProductsInfo[0],
      pChips: allProductsInfo[1],
      pCandy: allProductsInfo[2],
      changeDue: Number(changeDue).toFixed(2)
    });


  }



});


app.post("/", async function(req, res){

  // console.log(req.body.coinValue);
  const chosenCoin=req.body.coinValue.split("_");
  const diameter=chosenCoin[0];
  const thickness=chosenCoin[1];
  const weight=chosenCoin[2];

  //Get the coin value based on its properties
  //I am not strict on null hence ==
  let matchedCoinValue;
  let matchedCoinDocument= await dbs.MatchCoin(diameter,thickness,weight);
  if (matchedCoinDocument==null){
    matchedCoinValue=0
    totalCoinsInserted=totalCoinsInserted+matchedCoinValue;
    res.json({
      "totalCoinsInserted": totalCoinsInserted,
      "warningMessage": 'Coin Not Accepted'
    });
  }else{
    matchedCoinValue=matchedCoinDocument.value;
    totalCoinsInserted=totalCoinsInserted+matchedCoinValue;
    res.json({"totalCoinsInserted": totalCoinsInserted});
  };


});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
