export const commonFilterStyles = {
  padding: '6px',
  marginRight: '10px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  border: '2px solid #004262',
  fontSize: '14px',
}

export const positionSelectedFilterStyle = {
  ...commonFilterStyles,
  border: '2px solid #A020F0',
  backgroundColor: '#A020F0',
  color: 'white',
}

export const positionUnselectedFilterStyle = {
  ...commonFilterStyles,
  border: '2px solid #A020F0',
  backgroundColor: 'white',
  color: '#A020F0',
  opacity: '0.8',
}

export const sortButtonStyle = {
  ...commonFilterStyles,
  backgroundColor: '#56ba81',
  color: 'white',
  border: 'none',
}

export const switchTabButtonStyle = {
  ...commonFilterStyles,
  backgroundColor: '#900C3F',
  color: 'white',
  border: 'none',
}
