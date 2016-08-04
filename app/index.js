'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var isFile = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file) {
    var decoded, stats;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            decoded = decodeURIComponent(file);

            if (!(decoded !== _path2.default.join('.', decoded))) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', false);

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return (0, _promisify2.default)(_fs2.default.stat)(file);

          case 6:
            stats = _context.sent;

            if (stats.isFile()) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', false);

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](3);
            return _context.abrupt('return', false);

          case 14:
            return _context.abrupt('return', true);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 11]]);
  }));

  return function isFile(_x) {
    return _ref.apply(this, arguments);
  };
}();

require('babel-core/register');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaSend = require('koa-send');

var _koaSend2 = _interopRequireDefault(_koaSend);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisify = require('../lib/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

app.use(function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return next();

          case 3:
            _context2.next = 10;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);

            console.error(_context2.t0);
            ctx.body = { error: _context2.t0.message };
            ctx.status = _context2.t0.status || 500;

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 5]]);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}());

app.use(function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('%s : %s %s', new Date(), ctx.method, ctx.url);
            _context3.next = 3;
            return next();

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}());

app.use(function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
    var file, _ref5, _ref6, html, appjs, window;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            file = _path2.default.join('static', ctx.path);
            _context4.next = 3;
            return isFile(file);

          case 3:
            if (!_context4.sent) {
              _context4.next = 8;
              break;
            }

            _context4.next = 6;
            return (0, _koaSend2.default)(ctx, file);

          case 6:
            _context4.next = 20;
            break;

          case 8:
            _context4.next = 10;
            return Promise.all([(0, _promisify2.default)(_fs2.default.readFile)('static/app.html', 'utf8'), (0, _promisify2.default)(_fs2.default.readFile)('static/app.js', 'utf8')]);

          case 10:
            _ref5 = _context4.sent;
            _ref6 = (0, _slicedToArray3.default)(_ref5, 2);
            html = _ref6[0];
            appjs = _ref6[1];
            _context4.next = 16;
            return (0, _promisify2.default)(_jsdom2.default.env)(html, [], { src: [appjs] });

          case 16:
            window = _context4.sent;

            window.startApp();
            ctx.body = window.document.documentElement.outerHTML;
            window.close();

          case 20:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}());

app.listen(3000);
