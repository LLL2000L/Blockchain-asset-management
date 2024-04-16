pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract OneCompany {
    /**********************合约初始化: 开始*******************************/
    struct MetaMessage {
        address owner;

    }
    MetaMessage metaMessage;

    constructor() 
    {
        metaMessage.owner = msg.sender;

    }

    /**********************合约初始化: 结束*******************************/

    /**********************工具函数: 开始*******************************/

    modifier OnlyMaster() {
        require(isExist(msg.sender,master) != 0xFFFF);
        _;
    }
   
    modifier OnlyCommon() {
        require(isExist(msg.sender, common) != 0xFFFF);
        _;
    }

    // 查找某个人在某个数组是否存在
    function isExist(address target, address[] arr) private returns (uint256) {
        for (uint256 i = 0; i < arr.length; i++) if (arr[i] == target) return i;
        return 0xFFFF;
    }

    // 判断字符串相等
    function isEqual(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        bytes memory aa = bytes(a);
        bytes memory bb = bytes(b);
        if (aa.length != bb.length) return false;
        for (uint256 i = 0; i < aa.length; i++) {
            if (aa[i] != bb[i]) return false;
        }
        return true;
    }

    // 随机数生成, 作为 id
    function random() public view returns (uint16) {
        uint256 ret = uint256(blockhash(block.number - 1));
        ret = uint256(keccak256(abi.encodePacked(ret, now)));
        uint16 res = uint16(ret);
        // uint32 res = (uint32)ret;
        return res;
    }

    /**********************工具函数: 结束*******************************/

    /**********************角色管理: 开始*******************************/
    address[] master;
    address[] common;

    // 添加角色
    function addRole(string role, address _address) {
        if (isEqual(role, "master")) master.push(_address);
        if (isEqual(role, "common")) common.push(_address);
    }

    // 获取角色列表
    function getRole(string role) view returns (address[]) {
        if (isEqual(role, "master")) return master;
        if (isEqual(role, "common")) return common;
    }

    function getCommonCount() view returns (uint256) {
        return common.length;
    }

    /**********************角色管理: 结束*******************************/

    /**********************资产出入库: 开始*******************************/
    struct InOutApplication {
        // 2: 出库申请
        // 1: 入库申请
        uint256 ioType;
        uint256 id;
        string name;
        string assetsType;
        address personal;
        uint256 timeStamp;
        // 审批状态-1:审批失败 0:审批中 1:审批成功
        int256 state;
        // 备注
        string tips;
    }
    // 用来记录员工历史申请的池子 员工=>记录池子
    mapping(address => InOutApplication[]) inOutApplicationPool;


    // 员工获取申请历史
    function getApprovalHistory() view returns (InOutApplication[]) {
        return inOutApplicationPool[msg.sender];
    }

    // 公共出入库审批池子
    mapping(address => InOutApplication[]) inOutApplicationPoolPublic;

    // 员工仓库
    // 员工地址=>员工申请
    mapping(address => InOutApplication[]) store;

    // 员工查看自己的仓库
    function getStore() view returns (InOutApplication[]) {
        return store[msg.sender];
    }

    // 员工查看自己的仓库数量
    function getStoreCount() view returns (uint256) {
        return store[msg.sender].length;
    }

    // 管理员查看员工的仓库(放在仓库页)
    function getStore(address _common) view returns(InOutApplication[]) {
        return store[_common];
    }
    //员工查看出库审批中的数量
    function getStoreCountOut(address _common) view returns(uint256){
        uint256 out = 0;
        for (uint i = 0; i < inOutApplicationPool[_common].length; i++) {
                if (inOutApplicationPool[_common][i].state == 0 && inOutApplicationPool[_common][i].ioType == 2) {
                    out = out + 1;
                }
            }
            return out;
    }
        //员工查看入库审批中的数量
    function getStoreCountIn(address _common) view returns(uint256){
        uint256 countin = 0;
        for (uint i = 0; i < inOutApplicationPool[_common].length; i++) {
                if (inOutApplicationPool[_common][i].state == 0 && inOutApplicationPool[_common][i].ioType == 1) {
                    countin = countin +1;
                }
            }
            return countin;
    }

    // 员工提交一条申请(入库)
    function submitApplication(
        uint _ioType,
        string _name, 
        string _assetsType,
        string _tips
    ) OnlyCommon {
        uint256 _now = now;
        uint256 rand = random();
        InOutApplication memory aApplication = InOutApplication({
            ioType: 1,
            id: rand,
            name: _name,
            assetsType: _assetsType,
            personal: msg.sender,
            timeStamp: _now,
            state: 0,
            tips: _tips
        });

        // 1. 加入到记录员工历史申请的池子
        inOutApplicationPool[msg.sender].push(aApplication);
        // 2. 添加到公共审批池子
        inOutApplicationPoolPublic[msg.sender].push(aApplication);
    }

    // 员工发起一条出库申请，将入库状态变成出库
    function submitOutApplication(
        // ioType = 2表示出库
        uint256 _id,
        string  _name,
        string  _assetsType,
        string  _tips,
        address _common
    ) OnlyCommon {
        uint256 i = 0;
        uint256 _now = now;
        for (i = 0; i < inOutApplicationPoolPublic[_common].length; i++) {
                if (inOutApplicationPoolPublic[_common][i].id == _id) {
                    inOutApplicationPoolPublic[_common][i].state = 0;
                    inOutApplicationPoolPublic[_common][i].ioType = 2;
                    inOutApplicationPoolPublic[_common][i].timeStamp = _now;
                }
            }
        for (i = 0; i < inOutApplicationPool[_common].length; i++) {
                if (inOutApplicationPool[_common][i].id == _id) {
                    inOutApplicationPool[_common][i].state = 0;
                    inOutApplicationPool[_common][i].ioType = 2;
                    inOutApplicationPool[_common][i].timeStamp = _now;
                }
            }
        }

    // 管理员获取申请池子（公共审批池子），按照员工地址来取
    function getApprovalPool(address _common)
        view 
        returns (InOutApplication[])
    {
        return inOutApplicationPoolPublic[_common];
    }


    // 管理员对一条入库申请进行审批(资产id和审批意见)  审批意见: -1:不同意 1:同意
    function agreeApplication(
        address _common,
        uint256 ioType,
        uint256 _id,
        int256 state
    ) OnlyMaster {
        string _name;
        string _assetsType;
        uint256 _timeStamp;
        string _tips;
        uint256 i = 0;
        if (ioType == 1)  {
        // mapping(address => InOutApplication[]) inOutApplicationPoolPublic;
        // 1. 修改公共审批池子的内容
            for (i = 0; i < inOutApplicationPoolPublic[_common].length; i++) {
                if (inOutApplicationPoolPublic[_common][i].id == _id) {
                    inOutApplicationPoolPublic[_common][i].state = state;
                    _name = inOutApplicationPoolPublic[_common][i].name;
                    _assetsType = inOutApplicationPoolPublic[_common][i].assetsType;
                    _timeStamp = inOutApplicationPoolPublic[_common][i].timeStamp;
                    _tips = inOutApplicationPoolPublic[_common][i].tips;
                    break;
                }
            }

        // 2. 修改员工申请池子里的内容
            for (i = 0; i < inOutApplicationPoolPublic[_common].length; i++) {
                if (inOutApplicationPool[_common][i].id == _id) {
                    inOutApplicationPool[_common][i].state = state;
                    break;
                }
            }
            i = 0;

            if (state == 1) {                
                    // 如果是入库申请
                    // 1. 构造资产
                        InOutApplication memory aApplication = InOutApplication({
                            ioType: 1,
                            id: _id,
                            name: _name,
                            assetsType: _assetsType,
                            personal: _common,
                            timeStamp: _timeStamp,
                            state: 1,
                            tips: _tips
                        });
                        // 2. 添加进员工的仓库里
                        store[_common].push(aApplication);    
                }
        }
    }

    // 管理员对一条出库申请进行同意
    function agreeApplicationOut(
        address _common,
        uint256 ioType,
        uint256 _id,
        int256 state
    ) OnlyMaster  {
        string _name;
        string  _assetsType;
        uint256 _timeStamp;
        string _tips;
        uint256 i = 0;    
       
        // 1. 修改公共审批池子的内容
            for (i = 0; i < inOutApplicationPoolPublic[_common].length; i++) {
                if (inOutApplicationPoolPublic[_common][i].id == _id) {
                    inOutApplicationPoolPublic[_common][i].state = state;
                    _name = inOutApplicationPoolPublic[_common][i].name;
                    _assetsType = inOutApplicationPoolPublic[_common][i].assetsType;
                    _timeStamp = inOutApplicationPoolPublic[_common][i].timeStamp;
                    _tips = inOutApplicationPoolPublic[_common][i].tips;
                    break;
                }
            }
        // 2. 修改员工申请池子里的内容
            for (i = 0; i < inOutApplicationPoolPublic[_common].length; i++) {
                if (inOutApplicationPool[_common][i].id == _id) {
                    inOutApplicationPool[_common][i].state = state;
                    break;
                }
            }
            uint256 index = i;
            i = 0;
            if(state==1){
                // 5. 删除员工仓库的一条记录
                 // 使用替换法进行删除
                uint len = store[_common].length;
                store[_common][index] = store[_common][len-1];
                store[_common].length--;
            }
        
    }

    /**********************资产出入库: 结束*******************************/

    /**********************资产盘点: 开始*******************************/
    // 资产盘点任务的定义
    struct AssetsTask {
        string taskName;
        string assetsName;
        uint256 id;//资产ID
        string assetsType;
        address from;
        address to;
        // 盘点任务起始时间
        // string timeStartEnd;
        string timeStart;
        string timeEnd;
        // 盘点状态 false:未盘点 true:已盘点
        bool state;
        // 备注
        string tips;
    }
    // 资产盘点任务的结果的定义
    struct AssetsTaskResult {
        // 任务 id
        uint256 id;
        // 盘点数量
        uint256 count;
    }

    // 资产盘点任务池子 管理员=>发布过的任务
    mapping(address => AssetsTask[]) assetsTaskPool;
    // 员工完成任务后上报结果的池子 管理员=>发布过的任务的结果(任务id=>员工盘点出的数量)
    mapping(address => AssetsTaskResult[]) assetsTaskResultPool;

    // 管理员发布一条资产盘点任务
    function addAssetsTask(
        string _taskName,
        string _assetsName,
        uint256 _id,//资产ID
        string _assetsType,
        address _to,
        // string _timeStartEnd,
        string _timeStart,
        string  _timeEnd,
        string _tips
    ) OnlyMaster {
        // 1. 构造资产盘点任务
        AssetsTask memory assetsTask = AssetsTask({
            taskName: _taskName,
            assetsName: _assetsName,
            id: _id,
            assetsType: _assetsType,
            from: msg.sender,
            to: _to,
            // timeStartEnd: _timeStartEnd,
            timeStart: _timeStart,
            timeEnd: _timeEnd,
            state: false,
            tips: _tips

        });
        // 2. 添加到资产盘点任务池子
        assetsTaskPool[msg.sender].push(assetsTask);
    }

    // 员工查看资产盘点任务池子, 看看是否有自己的要处理的任务
    function getTask(address _master) OnlyCommon returns (AssetsTask[]) {
        return assetsTaskPool[_master];
    }

    
    //员工进行上报资产盘点结果
    function submitAssetsTaskResult(
        address _master,
        uint256 _id,//资产ID
        uint256 _count
    ) OnlyCommon {
        AssetsTaskResult memory aResult = AssetsTaskResult({
            id: _id,
            count: _count
        });
        assetsTaskResultPool[_master].push(aResult);
        // 修改资产盘点任务池子的状态
        for (uint256 i = 0; i < assetsTaskPool[_master].length; i++) {
            if (_id == assetsTaskPool[_master][i].id) {
                assetsTaskPool[_master][i].state = true;
                break;
            }
        }
    }

    // 管理员查看自己发布过的任务
    function getAssetsTaskPool() OnlyMaster returns (AssetsTask[]) {
        return assetsTaskPool[msg.sender];
    }

    // 管理员查看自己发布过的资产盘点任务的结果池子
    function getAssetsTaskResultPool() OnlyMaster returns (AssetsTaskResult[]) {
        return assetsTaskResultPool[msg.sender];
    }

    // 获取自己发布过的任务数
    function getTaskCount() view returns (uint256) {
        return assetsTaskPool[msg.sender].length;
    }

    // 获取自己发布过的任务的完成数
    function getTaskResultCount() view returns (uint256) {
        return assetsTaskResultPool[msg.sender].length;
    }

    /**********************资产盘点: 结束*******************************/

    /**********************资产调拨: 开始*******************************/

    struct CompanyKid {
        string name;
        address addr;
    }

    // 管理员查看某个员工的仓库
    function getStoreByCommon(address _common)         
        OnlyMaster
        returns (InOutApplication[])
    {
        return store[_common];
    }

    // 发送/接收的资产的定义
    struct SendReceive {
        uint256 id;
        string name;
        string assetsType;
        string tips;
        uint256 timeStamp;
    }
    // 接收过来的资产的暂存池子 来源用户=>来源用户发送过来的资产
    mapping(address => SendReceive[]) tmpStore;

    // 记录所有发送方的公司
    address[] senders;

    // 获取一些有用信息
    function getMsg(
        address _common,
        uint256 _id,
        address target
    ) returns (uint256, InOutApplication) {
        for (uint256 i = 0; i < store[_common].length; i++) {
            if (store[_common][i].id == _id) {
                return (i, store[_common][i]);
            }
        }
    }

    // 从员工仓库删除一条记录
    function delCommonStore(address _common, uint256 index) {
        // delete store[_common][index];
        // 使用替换法进行删除
        uint len = store[_common].length;
        store[_common][index] = store[_common][len-1];
        store[_common].length--;
    }


    // 这个方法是给其他公司调用的, 用来接收其他员工发送过来的资产的
    function receiveAssets(
        uint256 _id,
        string _name,
        string _assetsType,
        string _tips,
        address from
    ) {
        uint256 _now = block.timestamp;
        SendReceive memory aAssets = SendReceive({
            id: _id,
            name: _name,
            assetsType: _assetsType,
            tips: _tips,
            timeStamp: _now
        });
        tmpStore[from].push(aAssets);

        // 记录发送方公司
        senders.push(from);
    }

    struct GetTmpStore {
        address target;
        uint256 id;
        string name;
        string assetsType;
        string tips;
        uint256 timeStamp;
    }

    // 获取所有发送方公司
    function getSender() view returns (address[]) {
        return senders;
    }

    // 得到池子
    function getTmpStore(address _address) view returns (SendReceive[]) {
        return tmpStore[_address];
    }

    // 得到池子长度
    function getTmpStoreCount(address _address) view returns (uint256) {
        return tmpStore[_address].length;
    }

    // 将暂存池子里的资产发送给员工
    function sendAssetsToCommon(
        address target,
        uint256 _id,
        address to
    ) {
        uint256 index = 0;
        for (uint256 i = 0; i < tmpStore[target].length; i++) {
            if (tmpStore[target][i].id == _id) {
                index = i;
                break;
            }
        }
        InOutApplication memory tmp = InOutApplication({
            ioType: 1,
            id: _id,
            name: tmpStore[target][index].name,
            assetsType: tmpStore[target][index].assetsType,
            personal: target,
            timeStamp: tmpStore[target][index].timeStamp,
            state: 1,
            tips: "fromTargetToCommon"
        });
        store[to].push(tmp);

        uint len = tmpStore[target].length;
        tmpStore[target][index] = tmpStore[target][len-1];
        tmpStore[target].length--;

    }
    /**********************资产调拨: 结束*******************************/
}


