import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "@ton/core";
import WebApp from '@twa-dev/sdk'

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawal,
  } = useMainContract();

  const { connected } = useTonConnect();
  
  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  const contractBalanceOrDefault = contract_balance ?? 0;

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>{WebApp. platform}</b>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contractBalanceOrDefault && (
            <div className= 'Hint'>{fromNano(contractBalanceOrDefault)}</div>
          )}
        </div>

        {recent_sender?.toString()} {owner_address?.toString()}

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
      </div>

      <a
          onClick={() => {
            showAlert();
          }}
        >
          Show Alert
      </a>

      {connected && (
        <a onClick={() => {
          sendIncrement()
        }}>
          Increment by 5
        </a>
      )}

      <br/>

      {connected && (
        <a onClick={() => {
          sendDeposit()
        }}>
          Request deposit of 1 TON
        </a>
      )}

      <br/>

      {connected && (
        <a onClick={() => {
          sendWithdrawal()
        }}>
          Request Withdraw of 0.7 TON
        </a>
      )}

    </div>
  );
}

export default App;