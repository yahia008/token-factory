'use client';

import React, { useEffect, useState } from 'react';
import { decodeEventLog } from 'viem';
import { contractABI } from '../contract/mycontract';

interface TokenEvent {
  token: string;
  owner: string;
  name: string;
  symbol: string;
}

interface Props {
  receipt: any; // transaction receipt from wagmi
  onClose: () => void; // callback to close modal
}

const TokenCreatedModal: React.FC<Props> = ({ receipt, onClose }) => {
  const [tokenInfo, setTokenInfo] = useState<TokenEvent | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!receipt?.logs?.length) return;

    try {
      const parsed = receipt.logs
        .map((log: any) => {
          try {
            return decodeEventLog({
              abi: contractABI,
              data: log.data,
              topics: log.topics,
            });
          } catch (err) {
            console.warn('Could not decode log:', log, err);
            return null;
          }
        })
        .filter(Boolean);

      console.log('Emitted events:', parsed);

      if (parsed.length > 0) {
        const event = parsed[0];
        setTokenInfo({
          token: event.args.token,
          owner: event.args.owner,
          name: event.args.name,
          symbol: event.args.symbol,
        });
      }
    } catch (err) {
      console.error('Error parsing events:', err);
    }
  }, [receipt]);

  const handleCopy = () => {
    if (tokenInfo?.token) {
      navigator.clipboard.writeText(tokenInfo.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!tokenInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Token Created!</h2>

        <div className="space-y-2">
          <p><strong>Name:</strong> {tokenInfo.name}</p>
          <p><strong>Symbol:</strong> {tokenInfo.symbol}</p>
          <p><strong>Owner:</strong> {tokenInfo.owner}</p>
          <p className="flex items-center justify-between">
            <span><strong>Address:</strong> {tokenInfo.token}</span>
            <button
              onClick={handleCopy}
              className="ml-2 text-sm text-blue-600 hover:underline"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TokenCreatedModal;