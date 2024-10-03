export const getDate = (dateString: Date) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return formattedDate;
  };

  export const getTime = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if(diff<60000){
      return 'just now';
    }else if(diff<3600000){
      return `${Math.floor(diff/60000)} minutes ago`;
    }else if(diff<86400000){
      return `${Math.floor(diff/3600000)} hours ago`;
    }else if(diff<604800000){
      return `${Math.floor(diff/86400000)} days ago`;
    }else if(diff<2419200000){
      return `${Math.floor(diff/604800000)} weeks ago`;
    }else if(diff<29030400000){
      return `${Math.floor(diff/2419200000)} months ago`;
    }
  };