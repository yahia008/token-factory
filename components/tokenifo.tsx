"use client"
import React from 'react'
import CreateTokenForm from "../components/tokenForm"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import SearchBar from './search'

const TokenInfo = () => {
  return (
    <>
    
    <div className='mt-5 w-150 bg-white rounded-md p-5
    text-black  flex flex-col items-center font-bold'>
         <CreateTokenForm/>
        </div>
        </>
  )
}

export default TokenInfo