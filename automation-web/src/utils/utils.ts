class Utils {
  static getCurrentDateTime = () => {
    let date = Utils.formatDate(new Date());

    let hours: number | string = new Date().getHours();
    let min: number | string = new Date().getMinutes();
    let sec: number | string = new Date().getSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return date + " " + hours + ":" + min + ":" + sec;
  };

  static date = {
    isToday: (d1: Date) => {
      const current = new Date();
      const d2 = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      );
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
      );
    },
    isTommorow: (d1: Date) => {
      const current = new Date();
      const d2 = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1
      );
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
      );
    },
    isThisWeek: (d1: Date) => {
      const current = new Date();
      // @ts-ignore
      const delta_days = (d1 - current) / 1000 / 3600 / 24;
      return delta_days > 0 && delta_days < 7;
    },
    isThisMonth: (d1: Date) => {
      const current = new Date();
      const d2 = new Date(current.getFullYear(), current.getMonth());
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d2 > current
      );
    },
  };

  static formatTime = (date: Date): string => {
    let hour: number | string = date.getHours();
    let minutes: number | string = date.getMinutes();

    hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes === 0 ? "0" + minutes : minutes;
    return hour + ":" + minutes;
  };

  static formatDate = (date: Date): string => {
    let year: number | string = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day: number | string = date.getDate();
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
  };

  static constructDate = (date: string, time: string): Date => {
    return new Date(date + "T" + time);
  };

  static file2base64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event && event.target) {
          resolve(event.target.result as string);
        } else {
          reject();
        }
      };
    });

  static obj2obj_map = (
    obj: Record<string, any>,
    key2value_func: (key: string) => string
  ) =>
    Object.keys(obj).reduce(
      // @ts-ignore
      (o, key) => ({ ...o, [key]: key2value_func(key, obj[key]) }),
      {}
    );

  static arr2obj_map = (
    arr: any[],
    item2keyvalue_func: (i: any) => { key: string; value: any }
  ) =>
    new Map(
      arr.map((item) => [
        item2keyvalue_func(item).key,
        item2keyvalue_func(item).value,
      ])
    );

  static object2FormData = (obj: object): FormData => {
    const form = new FormData();
    for (const [key, val] of Object.entries(obj)) {
      console.log("key", key);
      if (key.includes("file") && val) {
        form.append(key, val);
      } else {
        val && form.append(key, JSON.stringify(val));
      }
    }
    return form;
  };

  static useNoWrapText = (text?: string): boolean => {
    if (!text) return true;
    return text.split(" ").filter((s) => s.length > 10).length > 0;
  };
}

export default Utils;
