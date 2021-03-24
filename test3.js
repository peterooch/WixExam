function countPairsOfSum(array, sum) {
    let o = {};
    for (var i in array) {
      const n = array[i];
      if (o[n] === undefined) {
        o[n] = 0;
      }
      o[n] += 1;
    }
    let pairs = 0;
    //console.log(o);
    for (var i in array) {
      const n = array[i];
      if (o[sum - n] !== undefined) {
        if (n === sum / 2 && o[n] === 1)
          continue;
        console.log(n, sum - n);
        pairs += o[n];
      }
    }
    return pairs / 2;
  }
  
  
  //console.log(countPairsOfSum([1,2,3,4], 3)); //1
  //console.log(countPairsOfSum([1,2,3,4], 4)); //1
  //console.log(countPairsOfSum([1,2,3,4], 5)); //2
  //console.log(countPairsOfSum([1,2,3,4], 6)); //1
  
  console.log(countPairsOfSum([0,1,6,5,5,9,4,10,10], 10)); //5