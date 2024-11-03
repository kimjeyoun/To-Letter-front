/**
 * 계절 관련 연결 파일 경로를 담는 변수
 * @param name 구분 이름
 * @param modelPath .obj확장자 models 경로
 * @param texturePath .mtl확장자 재질 경로
 * @param scale 모델별 크기
 */
export interface seasonFileI {
  modelPath: string,
  texturePath: string,
  scale: number
  color: string
  floorColor: string
}

export interface seasonFilesI {
  winter: seasonFileI
  spring: seasonFileI
  summer: seasonFileI
  autumn: seasonFileI
}



export const treePosition: number[][] = [
  [37, -25, -66],
  [34, -23, -70],
  [34, -24, -55],
  [37, -28, -19],
  [42, -26, -8],
  [40, -24, -28],
  [43, -26, -21],
  [39, -25, -25],
  [40, -25, -12],
  [39, -27, -2],
  [41, -29, -43],
  [43, -26, -30],
  [39, -25, -32],
  [38, -26, -53],
  [38, -24, -39],
  [39, -27, -36],
  [41, -29, -50],
  [37, -29, -5],
  [40, -28, -9],
  [38, -27, -13],
  [37, -29, 0],
  [39, -27, 2],

  // [67, -30, -66],
  // [64, -28, -70],
  // [64, -29, -55],
  // [67, -33, -19],
  // [72, -31, -8],
  [70, -29, -28],
  [73, -31, -21],
  [69, -30, -25],
  // [70, -30, -12],
  // [69, -32, -2],
  // [71, -34, -43],
  // [73, -31, -30],
  // [69, -30, -32],
  // [68, -31, -53],
  // [68, -29, -39],
  // [69, -32, -36],
  // [71, -34, -50],
  // [67, -34, -5],
  // [70, -33, -9],
  // [68, -32, -13],
  // [67, -34, 0],
  // [69, -32, 2],

  [67, -38, -80],
  [70, -30, -86],
  [68, -36, -89],
  [67, -38, -83],
  [69, -36, -78],
  [67, -38, -90],
  [70, -30, -96],
  [68, -36, -99],
  [67, -38, -93],
  [69, -36, -88],
  [67, -38, -97],
  [70, -30, -103],
  [68, -36, -106],
  [67, -38, -100],
  [69, -36, -95],

  // [97, -35, -66],
  // [94, -33, -70],
  // [94, -34, -55],
  // [97, -38, -19],
  // [102, -36, -8],
  // [100, -34, -28],
  // [103, -36, -21],
  // [99, -35, -25],
  // [100, -35, -12],
  // [99, -37, -2],
  // [101, -39, -43],
  // [103, -36, -30],
  // [99, -35, -32],
  // [98, -36, -53],
  // [98, -34, -39],
  // [99, -37, -36],
  // [101, -39, -50],
  // [97, -39, -5],
  // [100, -38, -9],
  // [98, -37, -13],
  // [97, -39, 0],
  // [99, -37, 2],
  // [97, -43, -80],
  [100, -35, -86],
  [98, -41, -89],
  [97, -43, -83],
  [99, -41, -78],

  
  [127,-40,  -66],
  [124,-38,  -70],
  [124,-39,  -55],
  [127,-43,  -19],
  [132, -41, -8],
  [130, -39, -28],
  [133, -41, -21],
  [129,-40,  -25],
  [130, -40, -12],
  [129,-42,  -2],
  [131, -44, -43],
  [133, -41, -30],
  [129,-40,  -32],
  [128,-40,  -53],
  [128,-39,  -39],
  [129,-42,  -36],
  [131, -44, -50],
  [127,-44,  -5],
  [130, -43, -9],
  [128,-42,  -13],
  [127,-44,  0],
  [129,-42,  2],
  [127,-48,  -80],
  [130, -40, -86],
  [128,-46,  -89],
  [127,-48,  -83],
  [129,-44,  -78],
]

export const grassPosition: number[][] = [
  [37, -28, -50],
  [43, -28, -50],
  [43, -29, -47],
  [42, -32, -50],
  [39, -30, -62],
  [42, -29, -59],
  [40, -27, -59],
]


/// 일반 비 구름

export const rainPosition: number[][] = [
  [100, 5, -40],
  [100, -1, -80],
  [100, -5, -5],
  [100, 6, -120], //맨 왼쪽 구름
  [100, 12, -90],//왼쪽 기준 두번째 줄 구름
  [100, -5, -120], //맨 왼쪽 구름
  [100, 18, -60], //왼쪽 기준 두번째 줄 구름
]

export const rainRotation: number[][] = [
  [0, Math.PI/4, 0],
  [0, Math.PI/12, 0],
  [0, Math.PI/4, 0.1],
  [0, Math.PI/6, 0.1],
  [0, Math.PI/4, 0.1],
  [0.1, Math.PI/4,0],
  [0.1, Math.PI/6, 0.1],
]

export const rainScale: number[] = [
  35, 32, 30, 30, 20, 30, 25
]


export const seasonFile: seasonFilesI = {
  winter: {
    modelPath: "/models/winterTree.glb",
    texturePath: "/images/scenery/treeTexture1.png",
    scale: 0.008,
    color: "#2f3335",
    floorColor:"#324233"
  },
  spring: {
    modelPath: "/models/springTree.glb",
    texturePath: "/images/scenery/treeTexture1.png",
    scale: 0.0035,
    color: "#576403",
    floorColor:"#387a3c"
  },
  summer: {
    modelPath: "/models/springTree.glb",
    texturePath: "/images/scenery/treeTexture1.png",
    scale: 0.0035,
    color: "#2a3f01",
    floorColor:"#205e24"
  },
  //기존
  // autumn: {
  //   modelPath: "/models/springTree.glb",
  //   texturePath: "/images/scenery/treeTexture1.png",
  //   scale: 0.0035,
  //   color: "#925115",
  //   floorColor:"#a7a323"
  // },
  //단일 트리 용량 줄임
  // autumn: {
  //   modelPath: "/models/tree.glb",
  //   texturePath: "/images/scenery/treeTexture1.png",
  //   scale: 0.072,
  //   color: "#925115",
  //   floorColor:"#a7a323"
  // },
  //전체 용량 줄임
  autumn: {
    modelPath: "/models/treeCollection.glb",
    texturePath: "/images/scenery/treeTexture1.png",
    scale: 0.072,
    color: "#925115",
    floorColor:"#a7a323"
  },
};