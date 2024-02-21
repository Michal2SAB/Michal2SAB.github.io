export function calculateRank(kills) {
    const thresholds = [
      5, 25, 100, 300, 750, 2000, 5000, 10000, 20000, 40000, 60000, 80000, 100000, 125000, 150000
    ];
  
    let rank = 0;
    for (let i = 0; i < thresholds.length; i++) {
      if (kills >= thresholds[i]) {
        rank = i + 1;
      } else {
        break;
      }
    }
  
    return rank;
  }

export function calculateRating(kd, rank) {
  let rating = "Rating: ";
    
  if (kd >= 0 && kd < 0.15) {
      rating += "D";
  } else if (kd >= 0.15 && kd < 0.3) {
      rating += "D+";
  } else if (kd >= 0.3 && kd < 0.4) {
      rating += "C-";
  } else if (kd >= 0.4 && kd < 0.55) {
      rating += "C";
  } else if (kd >= 0.55 && kd < 0.7) {
      rating += "C+";
  } else if (kd >= 0.7 && kd < 0.85) {
      rating += "B-";
  } else if (kd >= 0.85 && kd < 1) {
      rating += "B";
  } else if (kd >= 1 && kd < 1.3) {
      rating += "B+";
  } else if (kd >= 1.3 && kd < 1.7) {
      rating += "A-";
  } else if (kd >= 1.7 && kd < 2) {
      rating += "A";
  } else if ((kd >= 2 && kd < 3 && rank >= 7) || (kd >= 2 && rank >= 0 && rank < 7)) {
      rating += "A+";
  } else if ((kd >= 3 && kd < 5 && rank >= 7) || (kd >= 5 && rank === 7)) {
      rating += "A++";
  } else if (kd >= 5 && rank >= 8) {
      rating += "A+++";
  }
  
  return rating;
}

export function getHighscores(username) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://corsproxy.io/?http://www.xgenstudios.com/stickarena/highscore/', false);
    xhr.send();
    
    if (xhr.status === 200) {
        const html = xhr.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('table tr');

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length > 1 && cells[1].textContent.trim().toLowerCase() === username) {
                const rank = parseInt(cells[0].textContent.trim());
                return rank;
            }
        }
        return null;
    } else {
        console.error('Error fetching highscore rank:', xhr.statusText);
        return null;
    }
}