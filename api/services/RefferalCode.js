module.exports = {
    _config: {
        model: ['Users']
    },
	
    generateReferral:function(res) {
		var start, end, loop_end;
        if(typeof res.digit == 'undefined') {
			start = 2;
			end = 13;
			loop_end = 11;
		} else {
			start = 2;
			end = res.digit + start;
			loop_end = res.digit;
		}
		var code = Math.random().toString().slice(start, end);
		var position = 0,
			total = 0,
			m_pos = 1;
		while (position < loop_end) {
			if (position == 6) {
				m_pos = 8;
			}
			actualNum = m_pos * code[position];
			total += actualNum;
			position++;
			m_pos++;
		}
		chksm = total % (loop_end-1);
		chksm_pos = 6;
		begin = code.substr(0, chksm_pos);
		end = code.substr(chksm_pos);
		code = begin + '' + chksm + '' + end;
		return code;
    },
	
	displayReferral:function(res) {
		var code = res.code;
		str1 = code.substr(0, 4);
		str2 = code.substr(4, 4);
		str3 = code.substr(8, 4);
		code = str1 + '-' + str2 + '-' + str3;
		return code;
    },
	
	randomStringGen: function (res) {
		var length = 6;
		if(typeof res.length != 'undefined') {
			length = res.length;
		}
		//var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		//var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
		var chars = '0123456789';
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
};    