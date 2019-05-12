// Libraries
import React from 'react';
import DocuentTitle from 'react-document-title';
import Cookie from 'react-cookies';
// images
import logo from '../assets/img/logo.png';
import lock from '../assets/img/lock.png';
import unlock from '../assets/img/unlock.png';
// abi
// import abiBank from '../abi/abiBank';
// import abiPool from '../abi/abiPool';
import abiDFN from '../abi/abiDFN';
import abiDAI from '../abi/abiDAI';
import abiData from '../abi/abiData';
import abiPAX from '../abi/abiPAX';
import abiProxy from '../abi/abiProxy';
import abiTUSD from '../abi/abiTUSD';
import abiUSDC from '../abi/abiUSDC';
import abiUSDx from '../abi/abiUSDx';


class Item extends React.Component {
    displayName = "Item";
    hideNotification = () => {
        console.log(this.props.id);
        this.props.hideNotification(this.props.id);
    }
    render() {
        return (
            React.createElement("div", { className: 'col-' + this.props.classNames },
                React.createElement("button", { className: "close-box", onClick: this.hideNotification }),
                React.createElement("h3", { className: "notification-headline" }, this.props.title),
                React.createElement("div", { className: "notification-text" }, this.props.msg)
            )
        )
    }
};
class Notify extends React.Component {
    displayName = "Notify";
    key = 0;
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount = () => {}
    hideNotification = (id) => {
        const state = this.props.transcations;
        const keys = Object.keys(state);
        keys.map((key) => {
            if (key === id) {
                delete state[id];
                this.setState(state);
            };
            return false;
        })
    }
    render = () => {
        const state = this.props.transcations;
        const keys = Object.keys(state);
        const hide = this.hideNotification;
        const el = keys.map(function (key) {
            return React.createElement(Item, {
                id: key,
                key: key,
                classNames: state[key].class,
                title: state[key].title,
                msg: state[key].msg,
                hideNotification: hide
            }
            )
        });
        return (React.createElement("div", { className: "notifications-container" }, el));
    }
};


export default class Home extends React.Component {
    addressDAI = '0x235b370de0b0cd3fb9e987e4957a9db0f1c3dd5a';
    addressPAX = '0x9aa0fa0a4e2634fbbf1b716fcabf8650a8fa330f';
    addressTUSD = '0xebb02dbf58104b93af2a89ae55ef2d7a7be36247';
    addressUSDC = '0x676ce98a3bc9c191903262f887bb312ce20f851f';
    addressDFN = '0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4';
    addressUSDx = '0x17996ea27d03d68ddc618f9b8f0faf43838acaf6';
    addressProxy = '0x458C21b2F0eEef8Cf97D4a3A36DB89d5343010CE';
    addressBank = '0x28BBEFdE119D3d092FbBD1fb554253F7D3A40149';
    addressConvert = '0xDfBa945139272d484e33DD241A01Dc3Fc739A5f9';
    addressPool = '0xFA82A7522B01A0fAFb1c9cBB651A5d6a8d8963Fc';
    addressData = '0x901069049Ffc67F053c3B77597218FdBEfa3Bb2C';
    units = 10 ** 18;
    tatolSection = 0;

    constructor(props) {
        super(props);
        this.state = {
            transcations: {},
            toDeposit: 'DAI',
            toDepositNum: '',
            toWithdraw: 'DAI',
            toWithdrawNum: '',
            toDestroyNum: ''
        }
        if (window.web3) {
            this.Web3 = window.web3;
            this.contractDAI = this.Web3.eth.contract(abiDAI).at(this.addressDAI);
            this.contractPAX = this.Web3.eth.contract(abiPAX).at(this.addressPAX);
            this.contractTUSD = this.Web3.eth.contract(abiTUSD).at(this.addressTUSD);
            this.contractUSDC = this.Web3.eth.contract(abiUSDC).at(this.addressUSDC);
            this.contractDFN = this.Web3.eth.contract(abiDFN).at(this.addressDFN);
            this.contractUSDx = this.Web3.eth.contract(abiUSDx).at(this.addressUSDx);
            this.contractProxy = this.Web3.eth.contract(abiProxy).at(this.addressProxy);
            this.contractData = this.Web3.eth.contract(abiData).at(this.addressData);
        } else {
            alert ('pls install metamask first.');
        }

        setInterval(() => {
            if (!this.Web3.eth.coinbase) {
                return;
            }
            if (Cookie.load('isLogin') === 'false') {
                console.log('i am out')
                return;
            }
            if (this.state.accountAddress !== this.Web3.eth.coinbase) {
                this.connectMetamask();
            } else {
                return;
            }
            console.log('net or account changed')
        }, 2000);
    }
    componentWillMount () {}
    componentDidMount () {}
    render () {
        return (
            <DocuentTitle title='USDx portal'>
                <React.Fragment>
                    <Notify transcations={this.state.transcations}/>
                    <div className="headerWrap">
                        <div className="myHeader">
                            <div className="logo"><img src={logo} alt=""/></div>
                            <table className="balanceTable">
                                <tbody>
                                    <tr>
                                        <td>
                                            <span className="token noSelect">ETH</span>
                                            <span className="balance">{this.state.myETH? this.state.myETH : '0.0'}</span>
                                        </td>
                                        <td>
                                            <span className="token noSelect">DAI</span>
                                            <img className="noSelect" style={{display: this.state.approvedDAI? 'none':'inline-block'}} src={lock} alt="" onClick={() => {this.approve('DAI')}}/>
                                            <img className="noSelect" style={{display: this.state.approvedDAI? 'inline-block':'none'}} src={unlock} alt="" onClick={() => {this.lock('DAI')}}/>
                                            <span className="balance">{this.state.myDAI? this.state.myDAI : '0.0'}</span>
                                        </td>
                                        <td>
                                            <span className="token noSelect">PAX</span>
                                            <img className="noSelect" style={{display: this.state.approvedPAX? 'none':'inline-block'}}  src={lock} alt="" onClick={() => {this.approve('PAX')}}/>
                                            <img className="noSelect" style={{display: this.state.approvedPAX? 'inline-block':'none'}} src={unlock} alt="" onClick={() => {this.lock('PAX')}}/>
                                            <span className="balance">{this.state.myPAX? this.state.myPAX : '0.0'}</span>
                                        </td>
                                        <td>
                                            <span className="token noSelect">TUSD</span>
                                            <img className="noSelect" style={{display: this.state.approvedTUSD? 'none':'inline-block'}}  src={lock} alt="" onClick={() => {this.approve('TUSD')}}/>
                                            <img className="noSelect" style={{display: this.state.approvedTUSD? 'inline-block':'none'}} src={unlock} alt="" onClick={() => {this.lock('TUSD')}}/>
                                            <span className="balance">{this.state.myTUSD? this.state.myTUSD : '0.0'}</span>
                                        </td>
                                        <td>
                                            <span className="token noSelect">USDC</span>
                                            <img className="noSelect" style={{display: this.state.approvedUSDC? 'none':'inline-block'}}  src={lock} alt="" onClick={() => {this.approve('USDC')}}/>
                                            <img className="noSelect" style={{display: this.state.approvedUSDC? 'inline-block':'none'}} src={unlock} alt="" onClick={() => {this.lock('USDC')}}/>
                                            <span className="balance">{this.state.myUSDC? this.state.myUSDC : '0.0'}</span>
                                        </td>
                                        <td>
                                            <span className="token noSelect">DFN</span>
                                            <img className="noSelect" style={{display: this.state.approvedDFN? 'none':'inline-block'}}  src={lock} alt="" onClick={() => {this.approve('DFN')}}/>
                                            <img className="noSelect" style={{display: this.state.approvedDFN? 'inline-block':'none'}} src={unlock} alt="" onClick={() => {this.lock('DFN')}}/>
                                            <span className="balance">{this.state.myDFN? this.state.myDFN : '0.0'}</span>
                                        </td>
                                        <td className='noborder'>
                                            <span className="token noSelect">USDx</span>
                                            <img className="noSelect" style={{display: this.state.approvedUSDx? 'none':'inline-block'}}  src={lock} alt="" onClick={() => {this.approve('USDx')}}/>
                                            <img className="noSelect" style={{display: this.state.approvedUSDx? 'inline-block':'none'}} src={unlock} alt="" onClick={() => {this.lock('USDx')}}/>
                                            <span className="balance">{this.state.myUSDx? this.state.myUSDx : '0.0'}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="status">
                                <p className="title">
                                    <span className="netdot" style={{background: this.state.netTypeColor? this.state.netTypeColor : '#fff'}}></span>
                                    <span className="nettype">
                                        {this.state.netType? this.state.netType : 'Disconnect'}
                                    </span>
                                </p>
                                <p className="logoin" onClick={() => { this.DisconnectMetamask() }} style={{display: this.state.isConnected? 'block' : 'none'}}>
                                    {this.state.accountAddress? this.state.accountAddress.substring(0, 8) + '...' + this.state.accountAddress.substring(this.state.accountAddress.length - 6) : 'connect to metamask'}
                                </p>
                                <p className="logoin" onClick={() => { this.connectMetamask() }} style={{display: this.state.isConnected? 'none' : 'block'}}>
                                    {this.state.accountAddress? this.state.accountAddress.substring(0, 8) + '...' + this.state.accountAddress.substring(this.state.accountAddress.length - 6) : 'connect to metamask'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bodyWrap">
                        <div className="body">
                            <div className="bodyleft">
                                <div className="pool">
                                    <p className="token">DAI</p>
                                    <p className="per">
                                        <span className="section">{this.state.sectionDAI? this.state.sectionDAI : 'NaN'}</span>
                                        <span className="sectionNum">{this.state.DAIonPool? this.state.DAIonPool : '0.0'}</span>
                                    </p>
                                </div>
                                <div className="pool">
                                    <p className="token">PAX</p>
                                    <p className="per">
                                        <span className="section">{this.state.sectionPAX? this.state.sectionPAX : 'NaN'}</span>
                                        <span className="sectionNum">{this.state.PAXonPool? this.state.PAXonPool : '0.0'}</span>
                                    </p>
                                </div>
                                <div className="pool">
                                    <p className="token">TUSD</p>
                                    <p className="per">
                                        <span className="section">{this.state.sectionTUSD? this.state.sectionTUSD : 'NaN'}</span>
                                        <span className="sectionNum">{this.state.TUSDonPool? this.state.TUSDonPool : '0.0'}</span>
                                    </p>
                                </div>
                                <div className="pool">
                                    <p className="token">USDC</p>
                                    <p className="per">
                                        <span className="section">{this.state.sectionUSDC? this.state.sectionUSDC : 'NaN'}</span>
                                        <span className="sectionNum">{this.state.USDConPool? this.state.USDConPool : '0.0'}</span>
                                    </p>
                                </div>
                                <div className="line"></div>
                                <div className="total">
                                    <p className="title">Total USDx Outstanding</p>
                                    <p className="usdxNum">{this.state.totalSupplyUSDx? this.state.totalSupplyUSDx : '0.0'}</p>
                                </div>
                                <div className="globalpool">
                                    <p className="title">Global Collateral Pool</p>
                                    <p className="status">
                                        <span className="token">DAI</span>
                                        <span className="tokenNum">{this.state.DAIonBank? this.state.DAIonBank : '0.0'}</span>
                                    </p>
                                    <p className="status">
                                        <span className="token">PAX</span>
                                        <span className="tokenNum">{this.state.PAXonBank? this.state.PAXonBank : '0.0'}</span>
                                    </p>
                                    <p className="status">
                                        <span className="token">TUSD</span>
                                        <span className="tokenNum">{this.state.TUSDonBank? this.state.TUSDonBank : '0.0'}</span>
                                    </p>
                                    <p className="status">
                                        <span className="token">USDC</span>
                                        <span className="tokenNum">{this.state.USDConBank? this.state.USDConBank : '0.0'}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="bodyright">
                                <div className="generate">
                                    <h2 className="noSelect">Generate USDx</h2>
                                    <p className="details">Select which constituent would you like to deposit ?</p>
                                    <div className="input">
                                        <p style={{color: 'red'}}>{this.state.toDepositNum}</p> 
                                        <input type="number" onChange={(val) => {this.depositNumChange(val.target.value)}} value={this.state.toDepositNum} />
                                        <select name="" id="" defaultValue='DAI' onChange={(val) => {this.setState({...this.state, toDeposit: val.target.value})}}>
                                            <option value="DAI">DAI</option>
                                            <option value="PAX">PAX</option>
                                            <option value="TUSD">TUSD</option>
                                            <option value="USDC">USDC</option>
                                        </select>
                                    </div>
                                    <div className="clear"></div>
                                    <div className={this.state.couldDeposit? 'deposit activeDeposit' : 'deposit'} onClick={() => {this.deposit()}}>Deposit</div>
                                    <div className="errtips" style={{display : this.state.errTips? 'block': 'none' }}>
                                        <h4>Reminder</h4>
                                        The amount of {this.state.toDeposit} to be deposit exceeds your current balance.
                                    </div>
                                    <div className="myBalanceOnPool">
                                        <p className="title">Max USDx available to generate. </p>
                                        <p className='partToken'>USDx: {this.state.maxGenerateUSDx? this.state.maxGenerateUSDx : '0'}</p>
                                    </div>
                                </div>
                                <div className="generate">
                                    <h2 className="noSelect">Withdraw Constituents</h2>
                                    <p className="details">Select which constituent would you like to withdraw ?</p>
                                    <div className="input">
                                        <p style={{color: 'red'}}>{this.state.toWithdrawNum}</p> 
                                        <input type="number" onChange={(val) => {this.withdrawNumChange(val.target.value)}} value={this.state.toWithdrawNum} />
                                        <select name="" id="" defaultValue='DAI' onChange={(val) => {this.setState({...this.state, toWithdraw: val.target.value})}}>
                                            <option value="DAI">DAI</option>
                                            <option value="PAX">PAX</option>
                                            <option value="TUSD">TUSD</option>
                                            <option value="USDC">USDC</option>
                                        </select>
                                    </div>
                                    <div className="clear"></div>
                                    <div className={this.state.couldWithdraw? 'deposit activeWithdraw' : 'deposit'} onClick={() => {this.withdraw()}}>Withdraw</div>
                                    <div className="errtips" style={{display : this.state.errTipsWithdraw? 'block': 'none' }}>
                                        <h4>Reminder</h4>
                                        The amount of {this.state.toWithdraw} to be deposit exceeds your current balance.
                                    </div>
                                    <div className="myBalanceOnPool">
                                        <p className="title">Withdraw Constituents.</p>
                                        <p className='partToken'><span>DAI:</span> {this.state.myDAIonPool? this.state.myDAIonPool : '0.0'}</p>
                                        <p className='partToken'><span>PAX:</span> {this.state.myPAXonPool? this.state.myPAXonPool : '0.0'}</p>
                                        <p className='partToken'><span>TUSD:</span> {this.state.myTUSDonPool? this.state.myTUSDonPool : '0.0'}</p>
                                        <p className='partToken'><span>USDC:</span> {this.state.myUSDConPool? this.state.myUSDConPool : '0.0'}</p>
                                    </div>
                                </div>
                                <div className="generate nomargin">
                                    <h2 className="noSelect">Disaggregate USDx</h2>
                                    <p className="details">Select which constituent would you like to disaggregate ?</p>
                                    <div className="input">
                                        <p style={{color: 'red'}}>{this.state.toDestroyNum}</p>    
                                        <input type="number" onChange={(val) => {this.destroyNumChange(val.target.value)}} value={this.state.toDestroyNum} />
                                        <div className="select noSelect">USDx</div>
                                    </div>
                                    <div className="clear"></div>
                                    <div className={this.state.couldDestroy? 'deposit activeDestroy' : 'deposit'} onClick={() => {this.destroy()}}>Disaggregate</div>
                                    <div className="errtips" style={{display : this.state.errTipsDestroy? 'block': 'none' }}>
                                        <h4>Reminder</h4>
                                        The amount of {this.state.toDestroy} to be deposit exceeds your current balance.
                                    </div>
                                    <div className="myBalanceOnPool">
                                        <p className="title">How much constituents would expect to generate ?</p>
                                        <p className='partToken'><span>DAI:</span> {this.state.USDxToDAI? this.state.USDxToDAI : '0.0'}</p>
                                        <p className='partToken'><span>PAX:</span> {this.state.USDxToPAX? this.state.USDxToPAX : '0.0'}</p>
                                        <p className='partToken'><span>TUSD:</span> {this.state.USDxToTUSD? this.state.USDxToTUSD : '0.0'}</p>
                                        <p className='partToken'><span>USDC:</span> {this.state.USDxToUSDC? this.state.USDxToUSDC : '0.0'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                </React.Fragment>
            </DocuentTitle>
        )
    }

    // connectMetamask
    DisconnectMetamask () {
        this.setState({
            isConnected: false,
            accountAddress: ''
        })
        Cookie.save('isLogin', 'false', { path: '/' });
        window.location.reload();
        return;
    }
    // connectMetamask
    connectMetamask () {
        this.Web3.currentProvider.enable().then(
            res => {
                console.log('you connected.');
                this.setState({
                    ...this.state,
                    isConnected: true,
                    accountAddress: res[0]
                });
                this.getNetType();
                this.getMyBalance();
                this.getPoolBankTotalStatus();
                this.getMyBalanceOnPool();
                this.checkApprove();
                this.getTokenSection();
                Cookie.save('isLogin', 'true', { path: '/' });
            },
            err => {
                console.log(err);
                alert('cancel the connection');
            }
        );
    }


    // getNetType
    getNetType () {
        this.Web3.version.getNetwork((err, net) => {
            switch (net) {
                case '1':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#1abc9c',
                        netType: 'Main Ethereum Network'
                    });
                break;
                case '3':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#FC4E8E',
                        netType: 'Ropsten Test Network'
                    });
                break;
                case '4':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#F5C250',
                        netType: 'Rinkeby Test Network'
                    });
                break;
                case '42':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#715EFB',
                        netType: 'Kovan Test Network'
                    });
                break;
                default:
                    this.setState({
                        ...this.state,
                        netTypeColor: '#fff',
                        netType: 'Unknown Test Network'
                    });
            }
        });
    }


    // get the Token section
    getTokenSection () {
        this.contractData.mintSectionPosition.call((err, ret) => {
            if (ret) {
                this.contractData.sectionToken.call(ret.toFixed(), (e, r) => {
                    // console.log(e, r); r: [addr, addr, addr, addr]
                    if (r) {
                        for (let i = 0; i < r.length; i++) {
                            this.contractData.collateralWeight.call(ret.toFixed(), r[i], (error, result) => {
                                // console.log(r[i], ':', result.toFixed() / (10 ** 18));
                                if (r[i] === this.addressDAI) {
                                    this.sectionDAI = result.toFixed() / this.units;
                                    this.tatolSection = this.tatolSection + this.sectionDAI;
                                    this.setState({
                                        ...this.state,
                                        sectionDAI: this.sectionDAI,
                                        tatolSection: this.tatolSection
                                    })
                                }
                                if (r[i] === this.addressPAX) {
                                    this.sectionPAX = result.toFixed() / this.units;
                                    this.tatolSection = this.tatolSection + this.sectionPAX;
                                    this.setState({
                                        ...this.state,
                                        sectionPAX: this.sectionPAX,
                                        tatolSection: this.tatolSection
                                    })
                                }
                                if (r[i] === this.addressUSDC) {
                                    this.sectionUSDC = result.toFixed() / this.units;
                                    this.tatolSection = this.tatolSection + this.sectionUSDC;
                                    this.setState({
                                        ...this.state,
                                        sectionUSDC: this.sectionUSDC,
                                        tatolSection: this.tatolSection
                                    })
                                }
                                if (r[i] === this.addressTUSD) {
                                    this.sectionTUSD = result.toFixed() / this.units;
                                    this.tatolSection = this.tatolSection + this.sectionTUSD;
                                    this.setState({
                                        ...this.state,
                                        sectionTUSD: this.sectionTUSD,
                                        tatolSection: this.tatolSection
                                    })
                                }
                            });
                        }
                    }
                });
            }
        });
    }


    // getMyBalance
    getMyBalance () {
        this.Web3.eth.getBalance(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myETH: this.formatNumber(ret)
            });
        });
        this.contractDAI.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myDAI: this.formatNumber(ret)
            });
        });
        this.contractPAX.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myPAX: this.formatNumber(ret)
            });
        });
        this.contractTUSD.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myTUSD: this.formatNumber(ret)
            });
        });
        this.contractUSDC.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myUSDC: this.formatNumber(ret)
            });
        });
        this.contractDFN.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myDFN: this.formatNumber(ret)
            });
        });
        this.contractUSDx.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myUSDx: this.formatNumber(ret)
            });
        });
    }
    // getPoolBankTotalStatus
    getPoolBankTotalStatus () {
        this.contractUSDx.totalSupply.call((err, ret) => {
            this.setState({
                ...this.state,
                totalSupplyUSDx: this.formatNumber(ret)
            });
        });

        this.contractDAI.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                DAIonPool: this.formatNumber(ret)
            });
        });
        this.contractPAX.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                PAXonPool: this.formatNumber(ret)
            });
        });
        this.contractTUSD.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                TUSDonPool: this.formatNumber(ret)
            });
        });
        this.contractUSDC.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                USDConPool: this.formatNumber(ret)
            });
        });

        this.contractDAI.balanceOf.call(this.addressBank, (err, ret) => {
            this.setState({
                ...this.state,
                DAIonBank: this.formatNumber(ret)
            });
        });
        this.contractPAX.balanceOf.call(this.addressBank, (err, ret) => {
            this.setState({
                ...this.state,
                PAXonBank: this.formatNumber(ret)
            });
        });
        this.contractTUSD.balanceOf.call(this.addressBank, (err, ret) => {
            this.setState({
                ...this.state,
                TUSDonBank: this.formatNumber(ret)
            });
        });
        this.contractUSDC.balanceOf.call(this.addressBank, (err, ret) => {
            this.setState({
                ...this.state,
                USDConBank: this.formatNumber(ret)
            });
        });
    }
    // getMyBalanceOnPool
    getMyBalanceOnPool () {
        this.contractData.balanceOfTokens.call(this.addressDAI, this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myDAIonPool: this.formatNumber(ret)
            });
        });
        this.contractData.balanceOfTokens.call(this.addressPAX, this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myPAXonPool: this.formatNumber(ret)
            });
        });
        this.contractData.balanceOfTokens.call(this.addressTUSD, this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myTUSDonPool: this.formatNumber(ret)
            });
        });
        this.contractData.balanceOfTokens.call(this.addressUSDC, this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myUSDConPool: this.formatNumber(ret)
            });
        });
    }


    // format number
    formatNumber (BN) {
        let originStr = (BN.toFixed() / (10 ** 18)).toString();
        if ( originStr.indexOf('.') > 0 ) {
            originStr = originStr.substr(0, originStr.indexOf('.') + 5);
            if (originStr.length >= 12) {
                return originStr = originStr.substr(0, 11);
            } else {
                return originStr;
            }
        } else {
            return originStr;
        }
    }


    // check approve
    checkApprove () {
        this.contractDAI.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedDAI: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedDAI: true
                });
            }
        });
        this.contractPAX.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedPAX: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedPAX: true
                });
            }
        });
        this.contractTUSD.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedTUSD: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedTUSD: true
                });
            }
        });
        this.contractUSDC.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedUSDC: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedUSDC: true
                });
            }
        });
        this.contractDFN.allowance.call(this.state.accountAddress, this.addressConvert, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedDFN: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedDFN: true
                });
            }
        });
        this.contractUSDx.allowance.call(this.state.accountAddress, this.addressConvert, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedUSDx: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedUSDx: true
                });
            }
        });
    }


    // Approve token
    approve (token) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Approve ' + token) {
                return;
            }
        }

        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Approve ' + token
        }
        this.setState({tmepState});

        // witch token to be approved
        if (token === 'DAI') {
            this.contractDAI.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveDAItimer = setInterval(() => {
                            console.log('i am checking approve DAI...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveDAItimer);
                                    this.setState({
                                        ...this.state,
                                        approvedDAI: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositDAI) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositDAI: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
                                    }
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(approveDAItimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'PAX') {
            this.contractPAX.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approvePAXtimer = setInterval(() => {
                            console.log('i am checking approve PAX...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approvePAXtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedPAX: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositPAX) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositPAX: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
                                    }
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(approvePAXtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'TUSD') {
            this.contractTUSD.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveTUSDtimer = setInterval(() => {
                            console.log('i am checking approve TUSD...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveTUSDtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedTUSD: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositTUSD) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositTUSD: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
                                    }
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(approveTUSDtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'USDC') {
            this.contractUSDC.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveUSDCtimer = setInterval(() => {
                            console.log('i am checking approve USDC...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveUSDCtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedUSDC: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositUSDC) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositUSDC: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
                                    }
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(approveUSDCtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'DFN') {
            this.contractDFN.approve.sendTransaction(
                this.addressConvert,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveDFNtimer = setInterval(() => {
                            console.log('i am checking approve DFN...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveDFNtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedDFN: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDestroy1) {
                                        this.setState({
                                            ...this.state,
                                            fromDestroy1: false
                                        });
                                        setTimeout(() => {
                                            this.destroy();
                                        }, 4000)
                                    }
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(approveDFNtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'USDx') {
            this.contractUSDx.approve.sendTransaction(
                this.addressConvert,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Approve ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveUSDxtimer = setInterval(() => {
                            console.log('i am checking approve USDx...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveUSDxtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedUSDx: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDestroy2) {
                                        this.setState({
                                            ...this.state,
                                            fromDestroy2: false
                                        });
                                        setTimeout(() => {
                                            this.destroy();
                                        }, 4000)
                                    }
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(approveUSDxtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        }
        
    }
    // Lock token
    lock (token) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Lock ' + token) {
                return;
            }
        }

        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Lock ' + token,
        }
        this.setState({tmepState});

        // witch token to be locked
        if (token === 'DAI') {
            this.contractDAI.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockDAItimer = setInterval(() => {
                            console.log('i am checking lock DAI...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(lockDAItimer);
                                    this.setState({
                                        ...this.state,
                                        approvedDAI: false
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(lockDAItimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'PAX') {
            this.contractPAX.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockPAXtimer = setInterval(() => {
                            console.log('i am checking lock PAX...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(lockPAXtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedPAX: false
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(lockPAXtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'TUSD') {
            this.contractTUSD.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockTUSDtimer = setInterval(() => {
                            console.log('i am checking lock TUSD...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(lockTUSDtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedTUSD: false
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(lockTUSDtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'USDC') {
            this.contractUSDC.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockUSDCtimer = setInterval(() => {
                            console.log('i am checking lock USDC...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(lockUSDCtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedUSDC: false
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(lockUSDCtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'DFN') {
            this.contractDFN.approve.sendTransaction(
                this.addressConvert,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockDFNtimer = setInterval(() => {
                            console.log('i am checking lock DFN...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(lockDFNtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedDFN: false
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(lockDFNtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        } else if (token === 'USDx') {
            this.contractUSDx.approve.sendTransaction(
                this.addressConvert,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockUSDxtimer = setInterval(() => {
                            console.log('i am checking lock USDx...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(lockUSDxtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedUSDx: false
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                } 
                                if (data && data.status === '0x0') {
                                    clearInterval(lockUSDxtimer);
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                }
                            })
                        }, 2000);
                    }
                }
            );
        }
    }


    // withdraw number check
    withdrawNumChange (val) {
        if (val.length > 16) {
            return;
        }
        if (this.state.toWithdraw === 'DAI') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myDAIonPool)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
        if (this.state.toWithdraw === 'PAX') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myPAXonPool)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
        if (this.state.toWithdraw === 'TUSD') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSDonPool)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
        if (this.state.toWithdraw === 'USDC') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDConPool)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
    }
    // withdraw
    withdraw () {
        if (!this.state.couldWithdraw) {
            return;
        }

        var addr;
        var num = this.state.toWithdrawNum * this.units;
        if (this.state.toWithdraw === 'DAI') {
            addr = this.addressDAI;
            this.withdrawDAI(addr, num);
        } else if (this.state.toWithdraw === 'PAX') {
            addr = this.addressPAX;
            this.withdrawPAX(addr, num);
        } else if (this.state.toWithdraw === 'TUSD') {
            addr = this.addressTUSD;
            this.withdrawTUSD(addr, num);
        } else if (this.state.toWithdraw === 'USDC') {
            addr = this.addressUSDC;
            this.withdrawUSDC(addr, num);
        }
    }
    // withdrawDAI
    withdrawDAI (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw DAI') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw DAI',
        }
        this.setState({tmepState});
        this.contractProxy.withdraw.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw DAI') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw DAI') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawDAItimer = setInterval(() => {
                        console.log('i am checking withdraw DAI...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(withdrawDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }
    // withdrawPAX
    withdrawPAX (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw PAX') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw PAX',
        }
        this.setState({tmepState});
        this.contractProxy.withdraw.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw PAX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw PAX') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawPAXtimer = setInterval(() => {
                        console.log('i am checking withdraw PAX...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(withdrawPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }
    // withdrawTUSD
    withdrawTUSD (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw TUSD') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw TUSD',
        }
        this.setState({tmepState});
        this.contractProxy.withdraw.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw TUSD') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw TUSD') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawTUSDtimer = setInterval(() => {
                        console.log('i am checking withdraw TUSD...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(withdrawTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }
    // withdrawUSDC
    withdrawUSDC (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw USDC') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw USDC',
        }
        this.setState({tmepState});
        this.contractProxy.withdraw.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw USDC') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw USDC') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawUSDCtimer = setInterval(() => {
                        console.log('i am checking withdraw USDC...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(withdrawUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }


    // deposit number check
    depositNumChange (val) {
        if (val.length > 16) {
            return;
        }
        if (this.state.toDeposit === 'DAI') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myDAI)) {
                var num0 = (Number(this.state.DAIonPool) + Number(val)) / this.sectionDAI;
                var num1 = this.state.PAXonPool / this.sectionPAX;
                var num2 = this.state.TUSDonPool / this.sectionTUSD;
                var num3 = this.state.USDConPool / this.sectionUSDC;
                var numMin0 = Math.min(num0, num1, num2, num3);
                var maxGenerateDUSx0 = numMin0 >= 1 ? numMin0 * this.sectionDAI - this.state.DAIonPool : 0;
                this.setState({
                    ...this.state,
                    errTips: false,
                    couldDeposit: true,
                    toDepositNum: val,
                    maxGenerateUSDx: maxGenerateDUSx0
                })
            } else {
                this.setState({
                    ...this.state,
                    errTips: true,
                    couldDeposit: false,
                    toDepositNum: val,
                    maxGenerateUSDx: ''
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTips: false,
                        couldDeposit: false,
                        toDepositNum: val,
                        maxGenerateUSDx: ''
                    })
                }
            }
        }
        if (this.state.toDeposit === 'PAX') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myPAX)) {
                var num01 = this.state.DAIonPool / this.sectionDAI;
                var num11 = (Number(this.state.PAXonPool) + Number(val)) / this.sectionPAX ;
                var num21 = this.state.TUSDonPool / this.sectionTUSD;
                var num31 = this.state.USDConPool / this.sectionUSDC;
                var numMin1 = Math.min(num01, num11, num21, num31);
                var maxGenerateDUSx1 = numMin1 >= 1 ? numMin1 * this.sectionPAX - this.state.PAXonPool : 0;
                this.setState({
                    ...this.state,
                    errTips: false,
                    couldDeposit: true,
                    toDepositNum: val,
                    maxGenerateUSDx: maxGenerateDUSx1
                })
            } else {
                this.setState({
                    ...this.state,
                    errTips: true,
                    couldDeposit: false,
                    toDepositNum: val,
                    maxGenerateUSDx: ''
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTips: false,
                        couldDeposit: false,
                        toDepositNum: val,
                        maxGenerateUSDx: ''
                    })
                }
            }
        }
        if (this.state.toDeposit === 'TUSD') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSD)) {
                var num02 = this.state.DAIonPool / this.sectionDAI;
                var num12 = this.state.PAXonPool / this.sectionPAX;
                var num22 = (Number(this.state.TUSDonPool) + Number(val)) / this.sectionTUSD;
                var num32 = this.state.USDConPool / this.sectionUSDC;
                var numMin2 = Math.min(num02, num12, num22, num32);
                var maxGenerateDUSx2 = numMin2 >= 1 ? numMin2 * this.sectionTUSD - this.state.TUSDonPool : 0;
                this.setState({
                    ...this.state,
                    errTips: false,
                    couldDeposit: true,
                    toDepositNum: val,
                    maxGenerateUSDx: maxGenerateDUSx2
                })
            } else {
                this.setState({
                    ...this.state,
                    errTips: true,
                    couldDeposit: false,
                    toDepositNum: val,
                    maxGenerateUSDx: ''
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTips: false,
                        couldDeposit: false,
                        toDepositNum: val,
                        maxGenerateUSDx: ''
                    })
                }
            }
        }
        if (this.state.toDeposit === 'USDC') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDC)) {
                var num03 = this.state.DAIonPool / this.sectionDAI;
                var num13 = this.state.PAXonPool / this.sectionPAX;
                var num23 = this.state.TUSDonPool / this.sectionTUSD;
                var num33 = (Number(this.state.USDConPool) + Number(val)) / this.sectionUSDC;
                var numMin3 = Math.min(num03, num13, num23, num33);
                var maxGenerateDUSx3 = numMin3 >= 1 ? numMin3 * this.sectionUSDC - this.state.USDConPool : 0;
                this.setState({
                    ...this.state,
                    errTips: false,
                    couldDeposit: true,
                    toDepositNum: val,
                    maxGenerateUSDx: maxGenerateDUSx3
                })
            } else {
                this.setState({
                    ...this.state,
                    errTips: true,
                    couldDeposit: false,
                    toDepositNum: val,
                    maxGenerateUSDx: ''
                })
                if (val === '') {
                    this.setState({
                        ...this.state,
                        errTips: false,
                        couldDeposit: false,
                        toDepositNum: val,
                        maxGenerateUSDx: ''
                    })
                }
            }
        }
    }
    // deposit
    deposit () {
        if (!this.state.couldDeposit) {
            return;
        }

        var addr;
        var num = this.state.toDepositNum * this.units;
        if (this.state.toDeposit === 'DAI') {
            addr = this.addressDAI;
            this.depositDAI(addr, num);
        } else if (this.state.toDeposit === 'PAX') {
            addr = this.addressPAX;
            this.depositPAX(addr, num);
        } else if (this.state.toDeposit === 'TUSD') {
            addr = this.addressTUSD;
            this.depositTUSD(addr, num);
        } else if (this.state.toDeposit === 'USDC') {
            addr = this.addressUSDC;
            this.depositUSDC(addr, num);
        }
    }
    // deposit DAI
    depositDAI (addr, num) {
        if (!this.state.approvedDAI) {
            this.setState({
                ...this.state,
                fromDepositDAI: true
            });
            this.approve('DAI');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit DAI') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit DAI',
        }
        this.setState({tmepState});
        this.contractProxy.deposit.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit DAI') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit DAI') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositDAItimer = setInterval(() => {
                        console.log('i am checking deposit DAI...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(depositDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }
    // deposit PAX
    depositPAX (addr, num) {
        if (!this.state.approvedPAX) {
            this.setState({
                ...this.state,
                fromDepositPAX: true
            });
            this.approve('PAX');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit PAX') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit PAX',
        }
        this.setState({tmepState});
        this.contractProxy.deposit.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit PAX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit PAX') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositPAXtimer = setInterval(() => {
                        console.log('i am checking deposit PAX...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(depositPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }
    // deposit TUSD
    depositTUSD (addr, num) {
        if (!this.state.approvedTUSD) {
            this.setState({
                ...this.state,
                fromDepositTUSD: true
            });
            this.approve('TUSD');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit TUSD') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit TUSD',
        }
        this.setState({tmepState});
        this.contractProxy.deposit.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit TUSD') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit TUSD') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositTUSDtimer = setInterval(() => {
                        console.log('i am checking deposit TUSD...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(depositTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }
    // deposit USDC
    depositUSDC (addr, num) {
        if (!this.state.approvedUSDC) {
            this.setState({
                ...this.state,
                fromDepositUSDC: true
            });
            this.approve('USDC');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit USDC') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit USDC',
        }
        this.setState({tmepState});
        this.contractProxy.deposit.sendTransaction(
            addr,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit USDC') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit USDC') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositUSDCtimer = setInterval(() => {
                        console.log('i am checking deposit USDC...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(depositUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }


    // destroy number check
    destroyNumChange (val) {
        if (val.length > 16) {
            return;
        }
        if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDx)) {
            var USDxToDAI = this.formatNumber(val * (this.state.sectionDAI / this.state.tatolSection) * this.units);
            var USDxToPAX = this.formatNumber(val * (this.state.sectionPAX / this.state.tatolSection) * this.units);
            var USDxToTUSD = this.formatNumber(val * (this.state.sectionTUSD / this.state.tatolSection) * this.units);
            var USDxToUSDC = this.formatNumber(val * (this.state.sectionUSDC / this.state.tatolSection) * this.units);

            this.setState({
                ...this.state,
                errTipsDestroy: false,
                couldDestroy: true,
                toDestroyNum: val,
                USDxToDAI: USDxToDAI,
                USDxToPAX: USDxToPAX,
                USDxToTUSD: USDxToTUSD,
                USDxToUSDC: USDxToUSDC
            })
        } else {
            this.setState({
                ...this.state,
                errTipsDestroy: true,
                couldDestroy: false,
                toDestroyNum: val,
                USDxToDAI: '',
                USDxToPAX: '',
                USDxToTUSD: '',
                USDxToUSDC: ''
            })
            if (val === '') {
                this.setState({
                    ...this.state,
                    errTipsDestroy: false,
                    couldDestroy: false,
                    toDestroyNum: val,
                    USDxToDAI: '',
                    USDxToPAX: '',
                    USDxToTUSD: '',
                    USDxToUSDC: ''
                })
            }
        }
    }
    // destroy
    destroy () {
        if (!this.state.couldDestroy) {
            return;
        }

        if (!this.state.approvedDFN) {
            this.setState({
                ...this.state,
                fromDestroy1: true
            });
            this.approve('DFN');
            return;
        }

        if (!this.state.approvedUSDx) {
            this.setState({
                ...this.state,
                fromDestroy2: true
            });
            this.approve('USDx');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Destroy USDx') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Destroy USDx',
        }
        this.setState({tmepState});
        this.contractProxy.destroy.sendTransaction(
            this.state.toDestroyNum * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Destroy USDx') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Destroy USDx') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var destroyUSDxtimer = setInterval(() => {
                        console.log('i am checking destroy USDx...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(destroyUSDxtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                                setTimeout(() => {
                                    this.getMyBalance();
                                    this.getPoolBankTotalStatus();
                                    this.getMyBalanceOnPool();
                                }, 3000)
                            } 
                            if (data && data.status === '0x0') {
                                clearInterval(destroyUSDxtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
                                        }, 3000);
                                    };
                                    return false;
                                })
                            }
                        })
                    }, 2000);
                }
            }
        )
    }




}














