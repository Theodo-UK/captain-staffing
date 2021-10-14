export const commonFilterStyles = {
    padding: '6px',
    marginRight: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    border: '3px solid #004262',
  };
  
  export const companySelectedFilterStyle = {
    ...commonFilterStyles,
    border: '3px solid #004262',
    backgroundColor: '#004262',
    color: 'white',
  };
  
  export const companyUnselectedFilterStyle = {
    ...commonFilterStyles,
    border: '3px solid #004262',
    backgroundColor: 'white',
    color: '#004262',
    opacity: '0.8'
  };

  export const positionSelectedFilterStyle = {
    ...commonFilterStyles,
    border: '3px solid #A020F0',
    backgroundColor: '#A020F0',
    color: 'white',
  };
  
  export const positionUnselectedFilterStyle = {
    ...commonFilterStyles,
    border: '3px solid #A020F0',
    backgroundColor: 'white',
    color: '#A020F0',
    opacity: '0.8'
  };
  
  export const customFilterStyle = {
    ...commonFilterStyles,
    backgroundColor: '#33A5FF',
    color: 'white',
    border: 'none',
  };
  
  export const sortButtonFilterStyle = {
    ...commonFilterStyles,
    backgroundColor: '#56ba81',
    color: 'white',
    border: 'none',
    marginLeft: '40px'
  };