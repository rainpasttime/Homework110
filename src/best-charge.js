"use strict";
module.exports = function bestCharge(selectedItems) {

  let loadAllItems = require("./items");
  let loadPromotions = require("./promotions");
  let items = loadAllItems();
  let promotions = loadPromotions();
  let result = countItems(selectedItems);


  let sum = 0;
  let printf = "============= 订餐明细 =============\n";
  for(let i = 0;i<result.length;i++){
    for(let j = 0;j<items.length;j++){
      if(items[j].id===result[i].barcode){
        let money = parseInt(result[i].number)*items[j].price;
        sum+=money;
        printf+=items[j].name+" x "+result[i].number+" = "+money+"元\n";
        break;
      }
    }
  }
  let choose = choosePromotion(result,promotions[1].items,items);
  printf+="-----------------------------------\n";
  if(choose.type===1){
    let pay = sum-choose.sum;
    printf+="使用优惠:\n满30减6元，省6元\n-----------------------------------\n";
    printf+="总计："+pay.toString()+"元\n==================================="
  }
  else if(choose.type===2){
    let pay = sum-choose.sum;
    printf+="使用优惠:\n指定菜品半价(黄焖鸡，凉皮)，省"+choose.sum.toString()+"元\n-----------------------------------\n";
    printf+="总计："+pay.toString()+"元\n==================================="
  }
  else
  {
    printf+="总计："+sum.toString()+"元\n"
    printf+="===================================\n";
  }
  return printf;
};


function countItems(collection) {
  let result=[];
  for(let l = 0;l<collection.length;l++)
  {
    let number = collection[l].substring(collection[l].length-1);
    let barcode = collection[l].substring(0,8);
    let tag = -1;

    for(let t = 0;t<result.length;t++){
      if(result[t].barcode===barcode)
        tag = t;
    }
    if(tag===-1)
    {
      let tem = {};
      tem.barcode = barcode;
      tem.number = number;
      result.push(tem);
    }
    else
    {
        result[tag].number+=number;
    }
  }
  return result;
}

function choosePromotion(inputs,promotions,items) {
  let one = 0;
  let sum = 0;
  for(let i = 0;i<inputs.length;i++){
    for(let j = 0;j<items.length;j++){
      if(items[j].id===inputs[i].barcode){
        sum += parseInt(inputs[i].number)*items[j].price;
        break;
      }
    }
  }
  if(sum>=30)
    one = 6;

  let two = 0;
  sum = 0;
  for(let i =0;i<promotions.length;i++){
    for(let j = 0;j<inputs.length;j++){
      if(inputs[j].barcode===promotions[i]){
        for(let t = 0;t<items.length;t++){
          if(items[t].id===inputs[j].barcode){
            sum+=items[t].price*parseInt(inputs[j].number)/2;
          }
        }
      }
    }
  }
  two = sum;
  if(one>two){
    let result = {};
    result.type = 1;
    result.sum = one;
    return result;
  }
  else if(two>one){
    let result = {};
    result.type = 2;
    result.sum = two;
    return result;
  }
  else{
    let result = {};
    result.type = 0;
    result.sum = 0;
    return result;
  }

}

