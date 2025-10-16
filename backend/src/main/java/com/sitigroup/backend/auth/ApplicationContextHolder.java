package com.sitigroup.backend.auth;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextHolder implements ApplicationContextAware {
    private static ApplicationContext CTX;
    @Override public void setApplicationContext(ApplicationContext applicationContext) { CTX = applicationContext; }
    public static <T> T getBean(Class<T> type) { return CTX.getBean(type); }
}
