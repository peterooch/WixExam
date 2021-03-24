// Find the number of islands in a 2-dimensional array with 1’s and 0’s 
// 0 is considered as land and 1 is sea.
// An island is a set of 0's with a path between them 
// (moving top//button/left/right)

const parse = (input) => {
    return input.split('\n').map((row) => row.trim().split(''));
  };
  
  
  // 3 island
  const first = `
    11111111
    10010001
    11110101
    10010001
    11111111`;
  
  // 13
  const second = `
    1111011100
    1011111101
    1101111110
    1110111001
    1101111001
    1111100111
    1011111111
    1011110101
    1111100110
    1111110111`
  
  // 3
  const third = `
    11111111
    10010001
    11110101
    10010001
    11111111`;
  
  // 0
  const forth = `
    1`;
  
  // 1
  const fifth = `
    0`;
  
  // 1
  const sixth = `
    111
    101
    111`;
  const travel = (data, visited, y, x) => {
    const dimY = data.length;
    const dimX = data[1].length;
  
    if (y < 1 || y >= dimY || x < 0 || x >= dimX)
      return;
    if (data[y][x] === '1' || visited[`${y},${x}`] !== undefined)
      return;
  
    visited[`${y},${x}`] = true;
    travel(data, visited, y + 1, x);
    travel(data, visited, y - 1, x);
    travel(data, visited, y, x + 1);
    travel(data, visited, y, x - 1);
  }
  
  const countIslands = (data) => {
    const dimY = data.length;
    const dimX = data[1].length;
    let visited = {};
    let islands = 0;
    
    for (var y = 1; y < dimY; y++) { 
      for (var x = 0; x < dimX; x++) {
        //console.log(data[y][x], data[y][x] === '1', visited[`${y},${x}`]);
        if (data[y][x] === '1' || visited[`${y},${x}`] !== undefined) {
          continue;
        }
        travel(data, visited, y, x);
        islands++;
      }
    }
      return islands;
  }
  console.log(countIslands(parse(first)));
  console.log(countIslands(parse(second)));
  console.log(countIslands(parse(third)));
  console.log(countIslands(parse(forth)));
  console.log(countIslands(parse(fifth)));
  console.log(countIslands(parse(sixth)));