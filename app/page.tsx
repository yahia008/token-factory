
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import SearchBar from "../components/search";

export default function Home() {
  return (
    <>
    <div>
      
      <div className="flex justify-between items-center p-3">
        <SearchBar/>
         <ConnectButton />
      </div>
     
     <div className="flex justify-center mt-20 ">
      <div className="w-150 bg-white rounded-md h-120 shadow-full
       flex flex-col items-center">
            <div className="
            bg-black rounded-full
             font-bold flex w-96 mt-20 p-3 
             flex justify-center text-lg">
              <p>Token Factory</p>
              </div>

               <div className="text-black font-bold text-2xl mt-15">
                  <h1 className="font-extrabold text-center leading-tight">
                      Create, Launch and Manage Tokens <br />
                      on Ethereum (Sepolia Testnet)
                    </h1>
               </div>

               <div>
                  <p className="text-sm text-gray-500 text-center max-w-xl mx-auto mt-10">
                    Token Factory — Create and deploy ERC-20 tokens <br />
                    on the Ethereum Sepolia testnet. No coding required.
                  </p>
               </div>

              <div className="mt-10 bg-blue-600 p-3 rounded-md hover:bg-green-500 text-lg font-bold" >
                   <Link href="/create">
                   <button>Create Token</button>
                   </Link>
               </div>
               
      </div>
     </div>
    </div>
    </>
    
  
  );
}
