import bottle as b
from bottle import route, run, get
from sys import argv


@route('/', method='GET')
def index():
    return b.template("minecraft.html")


@get('/js/<filename:re:.*\.js>')
def javascripts(filename):
    return b.static_file(filename, root='js')


@get('/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return b.static_file(filename, root='css')


@get('/images/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return b.static_file(filename, root='images')


def main():
    run(host='0.0.0.0', port=argv[1])


if __name__ == '__main__':
    main()
