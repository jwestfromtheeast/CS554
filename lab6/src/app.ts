import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { Tasks } from './routes/tasks';
const reqcount: any = {};

class App {
  public app: express.Application;
  public taskRoutes: Tasks = new Tasks();

  constructor() {
    this.app = express();
    this.config();
    this.taskRoutes.routes(this.app);
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({ error: "Not found" });
    });
  }

  private Middleware1 = (req: Request, res: Response, next: NextFunction) => {
    console.log("======= Middleware =======")
    console.log("Request body:");
    console.log(JSON.stringify(req.body));
    console.log("URL path: " + req.path);
    console.log("Request verb: " + req.method);
    next();
  }

  private Middleware2 = (req: Request, res: Response, next: NextFunction) => {
    if (req.path in reqcount) {
      reqcount[req.path] += 1;
    } else {
      reqcount[req.path] = 1;
    }
    console.log("Current route visited " + reqcount[req.path] + " time(s)");
    console.log("");
    next();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false}));
    this.app.use(this.Middleware1);
    this.app.use(this.Middleware2);
  }
}

export default new App().app;
