package com.yyuap.summer;

import org.json.JSONException;
import org.json.JSONObject;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class SSOActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent login = getIntent();
        try {
            JSONObject loginJs = new JSONObject(login.getStringExtra("loginStr"));
            String clienKey = loginJs.optString("clientKey");
            String classFlag = loginJs.optString("classFlag");
            JSONObject extend = loginJs.optJSONObject("extend");
            String swrysfdm = extend.optString("swrysfdm");
            String swrydm = extend.optString("swrydm");

            Intent intent = new Intent(this, StartSummerActivity.class);
            JSONObject params = new JSONObject();
            JSONObject pageParam = new JSONObject();
            JSONObject actionBar = new JSONObject();
            JSONObject leftItem = new JSONObject();
            try {
                params.put("url", "html/index.html");
                pageParam.put("clienKey", clienKey);
                pageParam.put("classFlag", classFlag);
                pageParam.put("swrysfdm", swrysfdm);
                pageParam.put("swrydm", swrydm);
//新版本  原生头部配置
//                leftItem.put("image", "static/img/go_back.png");
//                leftItem.put("method", "");
//                actionBar.put("titleColor", "#333333");
//                actionBar.put("backgroundColor", "#ffffff");
//                actionBar.put("leftItem", leftItem);
//                params.put("type", "actionBar");
//                params.put("actionBar", actionBar);
                params.put("pageParam", pageParam);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            intent.putExtra("params", params.toString());

            this.startActivity(intent);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
