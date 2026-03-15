'use client';
import React, { useEffect, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, contractABI } from '../contract/mycontract';
import { decodeEventLog, Log } from 'viem';

interface TokenCreatedEvent {
  token: string;
  owner: string;
  name: string;
  symbol: string;
}

const CreateTokenForm: React.FC = () => {
  const [tokenName, setTokenName]     = useState('');
  const [symbol, setSymbol]           = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [tokenInfo, setTokenInfo]     = useState<TokenCreatedEvent | null>(null);
  const [copied, setCopied]           = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);

  const { writeContract, data: hash, isPending, isSuccess } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash,
    query: { enabled: !!hash }
  });

  // ── Parse TokenCreated event when receipt is available ────────────────
  useEffect(() => {
    if (!receipt?.logs?.length) return;
    if (!isSuccess) return;

    setErrorMsg(null);

    try {
      const tokenEvent = receipt.logs.find((log: Log) => {
        try {
          const decoded = decodeEventLog({
            abi: contractABI,
            data: log.data,
            topics: log.topics,
          });
          return decoded.eventName === 'TokenCreated'; // ← adjust name if different!
        } catch {
          return false;
        }
      });

      if (!tokenEvent) {
        console.warn('No TokenCreated event found in logs');
        setErrorMsg("Token probably created, but event not found in logs.");
        return;
      }

      const decoded = decodeEventLog({
        abi: contractABI,
        data: tokenEvent.data,
        topics: tokenEvent.topics,
      }) as unknown as { eventName: string; args: TokenCreatedEvent };

      if (decoded.eventName !== 'TokenCreated') return;

      const info: TokenCreatedEvent = {
        token:  decoded.args.token,
        owner:  decoded.args.owner,
        name:   decoded.args.name,
        symbol: decoded.args.symbol,
      };

      setTokenInfo(info);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to decode TokenCreated event:', err);
      setErrorMsg('Failed to read token information from blockchain');
    }
  }, [receipt, isSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setTokenInfo(null);     // reset previous result

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'createToken',
      args: [tokenName, symbol, BigInt(initialSupply)],
    });
  };

  const handleCopy = async () => {
    if (!tokenInfo?.token) return;

    try {
      await navigator.clipboard.writeText(tokenInfo.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="mt-5 max-w-md w-full bg-white rounded-md p-6 text-black shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        Create Your Token
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1.5 font-medium text-gray-700">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Awesome Token"
            required
          />
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-gray-700">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MAT"
            maxLength={8}
            required
          />
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-gray-700">Initial Supply</label>
          <input
            type="number"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000000"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className={`
            w-full py-3 px-6 rounded-lg font-bold text-white transition-colors
            ${isPending || isConfirming 
              ? 'bg-blue-400 cursor-wait' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
          `}
        >
          {isPending 
            ? 'Waiting for wallet...' 
            : isConfirming 
            ? 'Creating token...' 
            : 'Create Token'}
        </button>

        {errorMsg && (
          <p className="text-red-600 text-center text-sm mt-2">{errorMsg}</p>
        )}
      </form>

      {/* ── Success Modal ──────────────────────────────────────── */}
      {showModal && tokenInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Token Created Successfully! 🎉
            </h2>

            <div className="space-y-4 text-gray-800">
              <div>
                <span className="font-semibold">Name:</span> {tokenInfo.name}
              </div>
              <div>
                <span className="font-semibold">Symbol:</span> {tokenInfo.symbol}
              </div>
              <div>
                <span className="font-semibold">Owner:</span>{' '}
                <span className="font-mono text-sm break-all">{tokenInfo.owner}</span>
              </div>
              <div className="pt-2">
                <div className="font-semibold mb-1">Token Address:</div>
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                  <code className="font-mono text-sm break-all flex-1">
                    {tokenInfo.token}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`
                      px-4 py-2 rounded font-medium text-sm transition-colors flex-shrink-0
                      ${copied 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                    `}
                  >
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                // Optional: reset form
                setTokenName('');
                setSymbol('');
                setInitialSupply('');
              }}
              className="mt-8 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTokenForm;