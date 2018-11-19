var https = require('https');
var fs = require('fs');
var moment = require('moment');
var ca = fs.readFileSync('./cert/srca.cer.pem');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');//may be replace by setInterval
var log4js = require('log4js');
log4js.configure({
    appenders: {
    out:{ type: 'console' },
    app:{ type: 'file', filename: 'logs/site.log' }
    },
    categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
    }
    });

var logger = log4js.getLogger();
//https://kyfw.12306.cn/otn/leftTicket/queryZ?leftTicketDTO.train_date=2017-01-21&leftTicketDTO.from_station=ZZF&leftTicketDTO.to_station=SHH&purpose_codes=ADULT
var config = {
    time: '2017-01-21',//日期格式必须是这样
    from_station: 'ZZF',//始发站车站代码，这里是
    end_station: 'SHH',//
    train_num: 'G370',//车次
    your_mail: 'xfxbnb@163.com',
    mail_pass: '88'//放心写吧
};
var yz_temp = '', yw_temp = '';//保存余票状态
//https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2018-12-10&leftTicketDTO.from_station=CDW&leftTicketDTO.to_station=CSQ&purpose_codes=ADULT
function queryTickets(config) {
    var url = 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2018-12-10&leftTicketDTO.from_station=CDW&leftTicketDTO.to_station=CSQ&purpose_codes=ADULT';
    var options = {
        hostname: 'kyfw.12306.cn',//12306
        //path: '/otn/leftTicket/query?leftTicketDTO.train_date=' + config.time + '&leftTicketDTO.from_station=' + config.from_station
        //+ '&leftTicketDTO.to_station=' + config.end_station + '&purpose_codes=ADULT',
        path: '/otn/leftTicket/query?leftTicketDTO.train_date=2018-12-10&leftTicketDTO.from_station=CDW&leftTicketDTO.to_station=CSQ&purpose_codes=ADULT',
        //ca: [ca],//证书
        rejectUnauthorized: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
            "Connection": "keep-alive",
            "Cache-Control": "max-age=0",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": "_jc_save_fromStation=%u4E0A%u6D77%2CSHH; _jc_save_toStation=%u798F%u5DDE%2CFZS; _jc_save_fromDate=2018-11-08; _jc_save_toDate=2018-11-08; _jc_save_wfdc_flag=dc; BIGipServerotn=1139802634.38945.0000; RAIL_EXPIRATION=1542922534672; RAIL_DEVICEID=Dd0YzRN17X9KF9oroAffFGrZ_fG_Ql3tj3FjmogX8c6FTNRqNVFxvcJ6IfyO8-MRVhCtazT3MLDZ5K7cz6FFXy_e_a864obvZVGGgR3-No4CkzG1odhBmYgqbvVaBjXXJ363_FWtS3HPVCLlMi7XjvVNs0h2tiBR; BIGipServerpool_passport=351076874.50215.0000"
            
        }    
    };

//    options = {
//        Host: "kyfw.12306.cn",
// Connection: "keep-alive",
// Cache-Control: "max-age=0",
// Upgrade-Insecure-Requests: "1",
// User-Agent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
// Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
// Accept-Encoding: "gzip, deflate, br",
// Accept-Language: "zh-CN,zh;q=0.9",
// Cookie: "_jc_save_fromStation=%u4E0A%u6D77%2CSHH; _jc_save_toStation=%u798F%u5DDE%2CFZS; _jc_save_fromDate=2018-11-08; _jc_save_toDate=2018-11-08; _jc_save_wfdc_flag=dc; BIGipServerotn=1139802634.38945.0000; RAIL_EXPIRATION=1542922534672; RAIL_DEVICEID=Dd0YzRN17X9KF9oroAffFGrZ_fG_Ql3tj3FjmogX8c6FTNRqNVFxvcJ6IfyO8-MRVhCtazT3MLDZ5K7cz6FFXy_e_a864obvZVGGgR3-No4CkzG1odhBmYgqbvVaBjXXJ363_FWtS3HPVCLlMi7XjvVNs0h2tiBR; BIGipServerpool_passport=351076874.50215.0000"
// };

    var req = https.get(options, function (res) {
        var data = '';
        res.on('data', function (buff) {
            data += buff;
            logger.info("buff:" + buff);
        });
        res.on('end', function () {
            //logger.info("data:" + JSON.stringify(data));
            logger.info("end");
            return;
            
            if (JSON.parse(data).status == 'false') {
                logger.info("GetUrl:" + JSON.parse(data).status);
                return;
            }
            var title='编号   车次   商务座   ';
            logger.info(title);
            var jsonData = JSON.parse(data).data;
            for (var i = 0; i < jsonData.length; i++) {
                var cur = jsonData[i];
                if (true) {
                    var str=""+(i+1)+":   ";
                    str+=cur.queryLeftNewDTO.station_train_code.toString() + "   ";
                    str+=cur.queryLeftNewDTO.train_type_code + "   " ;
                    str+=cur.queryLeftNewDTO.swz_num + "   " ;
                    str+=cur.queryLeftNewDTO.canWebBuy + "   " ;
                    logger.info(str);
                } else {

                }
                if (cur.queryLeftNewDTO.station_train_code == config.train_num) {
                    // console.log(cur);
                    console.log(config.train_num);
                    console.log('商务座:' + cur.queryLeftNewDTO.swz_num);
                    var yz = cur.queryLeftNewDTO.yz_num;//硬座数目
                    var yw = cur.queryLeftNewDTO.yw_num;//硬卧数目
                    var trainNum = cur.queryLeftNewDTO.station_train_code;//车次
                    if (yz != '无' && yz != '--' || yw != '无' && yw != '--') {
                        if (yw_temp == yw && yz_temp == yz) {//当余票状态发生改变的时候就不发送邮件
                            console.log('状态没改变，不重复发邮件');
                            return;
                        }
                        var mailOptions = {
                            from: config.your_mail, // 
                            to: config.your_mail, // 
                            subject: trainNum + '有票啦，硬座：' + yz + '，硬卧：' + yw, // 邮件标题
                            text: trainNum + '有票啦\n' + '时间是' + cur.queryLeftNewDTO.start_train_date + ',\n出发时间:' + cur.queryLeftNewDTO.start_time + ',\n到达时间:' + cur.queryLeftNewDTO.arrive_time + ',\n历时：' + cur.queryLeftNewDTO.lishi + ',\n始发站：' + cur.queryLeftNewDTO.from_station_name + ',\n到达：' + cur.queryLeftNewDTO.to_station_name, // 邮件内容
                        };
                    } else {
                        console.log('硬座/硬卧无票');
                        //logger.info("piao:" + cur.queryLeftNewDTO.station_train_code);
                        //logger.error("WU piao");
                    }
                    break;
                }
            }
        })
    });
    req.on('error', function (err) {
        logger.error('error:' + err.code);
        console.error('error:' + err.code);
    });
}
var rule = new schedule.RecurrenceRule();
rule.second = [0];
schedule.scheduleJob(rule, function () {
    queryTickets(config);
    console.log('scheduleCronstyle:' + moment().format('YYYY-MM-DD HH:mm:ss'));
}); 