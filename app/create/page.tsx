import React from 'react'
import { RiCoinsLine } from "react-icons/ri";
import TokenInfo from '@/components/tokenifo';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SearchBar from '@/components/search';

const CreatePage = () => {
  return (
    <>
     <div className="flex justify-between items-center p-3">
        <SearchBar/>
         <ConnectButton />
      </div>
    <div className='flex flex-col items-center'>
        <div className='flex flex-col justify-center items-center mt-5'>
            <RiCoinsLine  className='text-yellow-500 text-5xl 
            mt-10 '/>
            <h1 className='mt-5 font-extrabold text-xl'>Create token on Sepolia</h1>

            <p className="text-sm text-gray-500 text-center max-w-xl mx-auto mt-5">
            Launch your own token on the Ethereum Sepolia testnet. <br />
            With our intuitive tool, you can easily generate <br />
            and deploy your own ERC-20 token.
            </p>
        </div>

        <div>
        <TokenInfo/>
        </div>
       
    </div>

    </>
    
  ) 
}

export default CreatePage