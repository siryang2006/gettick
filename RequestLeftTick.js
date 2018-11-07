var RequestBase = require('./libs/RequestBase.js');
var fs = require('fs');

var UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";
class RequestLeftTick extends RequestBase{
    onData(options, body) {
        console.log(" ==========================onData body:"+body);
    }

    onError(options, error, body) {
        console.log(" onError body:"+body);
    }

    onFinished(options) {
    }

    start(){
        var config = {
            time:'2017-01-21',//日期格式必须是这样
            from_station:'BJP',//始发站车站代码，这里是北京北
            end_station:'XMS',//厦门
            train_num:'K571',//车次
            ticket_type:'ADULT',
            your_mail:'****@163.com',//你自己的邮箱，我这里用的是163邮箱，如果你要改其他类型的邮箱的话，那请你修改transporter里的服务器信息
            mail_pass:'****'//放心写吧
            };

        /*设置请求头参数*/
        var options = {
            method:'GET',
            url:'https://kyfw.12306.cn/otn/leftTicket/queryT?leftTicketDTO.train_date=2018-10-16&leftTicketDTO.from_station=SZH&leftTicketDTO.to_station=XCH&purpose_codes=ADULT',
            //path: '/otn/leftTicket/query?leftTicketDTO.train_date='+config.time+'&leftTicketDTO.from_station='+config.from_station+'&leftTicketDTO.to_station='+config.end_station+'&purpose_codes='+config.ticket_type,
            //ca:fs.readFileSync('./cert/srca.cer.pem'),//证书
            strictSSL: false,
            secureProtocol: 'TLSv1_method',
            headers:{
            'Connection':'keep-alive',
            'Host':'kyfw.12306.cn',
            'User-Agent': UA,
            "Connection":"keep-alive",
            "Referer":"https://kyfw.12306.cn/otn/leftTicket/init",
            "Cookie":"__NRF=D2A7CA0EBB8DD82350AAB934FA35745B; JSESSIONID=0A02F03F9852081DDBFEA4AA03EF4252C569EB7AB1; _jc_save_detail=true; _jc_save_showIns=true; BIGipServerotn=1072693770.38945.0000; _jc_save_fromStation=%u77F3%u5BB6%u5E84%2CSJP; _jc_save_toStation=%u5408%u80A5%2CHFH; _jc_save_fromDate=2017-02-17; _jc_save_toDate=2017-01-19; _jc_save_wfdc_flag=dc",
            }
        };
        console.log("start...");
        super.req(options);
    }
}

module.exports = RequestLeftTick