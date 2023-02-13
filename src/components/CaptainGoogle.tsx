import React from 'react'

import { checkAuth, load } from '../helpers/spreadsheet'

interface CaptainGoogleProps {
  onSuccess: () => void
  onFailure: () => void
  onLoad: (data: any) => void
}

const CaptainGoogle: React.FC<CaptainGoogleProps> = (props) => {
  const handleAuth = (authResult: any) => {
    if (authResult && !authResult.error) {
      props.onSuccess()
      load(props.onLoad)
    } else {
      props.onFailure()
    }
  }

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    checkAuth(false, handleAuth)
  }

  return (
    <button
      onClick={onClick}
      className="btn"
    >
      Connect with Google
    </button>
  )
}

export default CaptainGoogle
