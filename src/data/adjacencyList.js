// src/data/adjacencyList.js
const adjacencyList = {
  "Connaught Place": [
    { location: "India Gate", distance: 2.5 },
    { location: "Lodi Gardens", distance: 5.0 },
    { location: "Karol Bagh", distance: 4.0 },
    { location: "Chandni Chowk", distance: 4.5 },
    { location: "Hauz Khas", distance: 8.0 },
    { location: "Jantar Mantar", distance: 1.2 },
    { location: "Red Fort", distance: 5.5 },
    { location: "Qutub Minar", distance: 12.0 },
    { location: "Akshardham Temple", distance: 9.0 },
    { location: "DMC", distance: 0.5 }
  ],
  "India Gate": [
    { location: "Connaught Place", distance: 2.5 },
    { location: "Lodi Gardens", distance: 3.5 },
    { location: "Karol Bagh", distance: 5.0 },
    { location: "Chandni Chowk", distance: 4.0 },
    { location: "Hauz Khas", distance: 10.0 },
    { location: "Jantar Mantar", distance: 1.8 },
    { location: "Red Fort", distance: 5.2 },
    { location: "Qutub Minar", distance: 13.0 },
    { location: "Akshardham Temple", distance: 8.5 },
    { location: "DMC", distance: 1.0 }
  ],
  "Lodi Gardens": [
    { location: "Connaught Place", distance: 5.0 },
    { location: "India Gate", distance: 3.5 },
    { location: "Karol Bagh", distance: 7.0 },
    { location: "Chandni Chowk", distance: 6.0 },
    { location: "Hauz Khas", distance: 6.0 },
    { location: "Jantar Mantar", distance: 4.0 },
    { location: "Red Fort", distance: 8.0 },
    { location: "Qutub Minar", distance: 9.0 },
    { location: "Akshardham Temple", distance: 10.0 },
    { location: "DMC", distance: 7.5 }
  ],
  "Karol Bagh": [
    { location: "Connaught Place", distance: 4.0 },
    { location: "India Gate", distance: 5.0 },
    { location: "Lodi Gardens", distance: 7.0 },
    { location: "Chandni Chowk", distance: 6.5 },
    { location: "Hauz Khas", distance: 11.0 },
    { location: "Jantar Mantar", distance: 3.5 },
    { location: "Red Fort", distance: 6.5 },
    { location: "Qutub Minar", distance: 12.5 },
    { location: "Akshardham Temple", distance: 10.5 },
    { location: "DMC", distance: 4.0 }
  ],
  "Chandni Chowk": [
    { location: "Connaught Place", distance: 4.5 },
    { location: "India Gate", distance: 4.0 },
    { location: "Lodi Gardens", distance: 6.0 },
    { location: "Karol Bagh", distance: 6.5 },
    { location: "Hauz Khas", distance: 12.0 },
    { location: "Jantar Mantar", distance: 3.0 },
    { location: "Red Fort", distance: 3.5 },
    { location: "Qutub Minar", distance: 13.5 },
    { location: "Akshardham Temple", distance: 9.5 },
    { location: "DMC", distance: 3.5 }
  ],
  "Hauz Khas": [
    { location: "Connaught Place", distance: 8.0 },
    { location: "India Gate", distance: 10.0 },
    { location: "Lodi Gardens", distance: 6.0 },
    { location: "Karol Bagh", distance: 11.0 },
    { location: "Chandni Chowk", distance: 12.0 },
    { location: "Jantar Mantar", distance: 8.5 },
    { location: "Red Fort", distance: 15.0 },
    { location: "Qutub Minar", distance: 8.0 },
    { location: "Akshardham Temple", distance: 14.0 },
    { location: "DMC", distance: 10.0 }
  ],
  "Jantar Mantar": [
    { location: "Connaught Place", distance: 1.2 },
    { location: "India Gate", distance: 1.8 },
    { location: "Lodi Gardens", distance: 4.0 },
    { location: "Karol Bagh", distance: 3.5 },
    { location: "Chandni Chowk", distance: 3.0 },
    { location: "Hauz Khas", distance: 8.5 },
    { location: "Red Fort", distance: 4.5 },
    { location: "Qutub Minar", distance: 11.0 },
    { location: "Akshardham Temple", distance: 7.5 },
    { location: "DMC", distance: 1.5 }
  ],
  "Red Fort": [
    { location: "Connaught Place", distance: 5.5 },
    { location: "India Gate", distance: 5.2 },
    { location: "Lodi Gardens", distance: 8.0 },
    { location: "Karol Bagh", distance: 6.5 },
    { location: "Chandni Chowk", distance: 3.5 },
    { location: "Hauz Khas", distance: 15.0 },
    { location: "Jantar Mantar", distance: 4.5 },
    { location: "Qutub Minar", distance: 14.0 },
    { location: "Akshardham Temple", distance: 10.0 },
    { location: "DMC", distance: 5.0 }
  ],
  "Qutub Minar": [
    { location: "Connaught Place", distance: 12.0 },
    { location: "India Gate", distance: 13.0 },
    { location: "Lodi Gardens", distance: 9.0 },
    { location: "Karol Bagh", distance: 12.5 },
    { location: "Chandni Chowk", distance: 13.5 },
    { location: "Hauz Khas", distance: 8.0 },
    { location: "Jantar Mantar", distance: 11.0 },
    { location: "Red Fort", distance: 14.0 },
    { location: "Akshardham Temple", distance: 8.0 },
    { location: "DMC", distance: 10.0 }
  ],
  "Akshardham Temple": [
    { location: "Connaught Place", distance: 9.0 },
    { location: "India Gate", distance: 8.5 },
    { location: "Lodi Gardens", distance: 10.0 },
    { location: "Karol Bagh", distance: 10.5 },
    { location: "Chandni Chowk", distance: 9.5 },
    { location: "Hauz Khas", distance: 14.0 },
    { location: "Jantar Mantar", distance: 7.5 },
    { location: "Red Fort", distance: 10.0 },
    { location: "Qutub Minar", distance: 8.0 },
    { location: "DMC", distance: 9.0 }
  ],
  "DMC": [
    { location: "Connaught Place", distance: 0.5 },
    { location: "India Gate", distance: 1.0 },
    { location: "Lodi Gardens", distance: 7.5 },
    { location: "Karol Bagh", distance: 4.0 },
    { location: "Chandni Chowk", distance: 3.5 },
    { location: "Hauz Khas", distance: 10.0 },
    { location: "Jantar Mantar", distance: 1.5 },
    { location: "Red Fort", distance: 5.0 },
    { location: "Qutub Minar", distance: 10.0 },
    { location: "Akshardham Temple", distance: 9.0 }
  ]
};

export default adjacencyList;
