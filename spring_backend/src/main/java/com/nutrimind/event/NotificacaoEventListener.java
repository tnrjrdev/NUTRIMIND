package com.nutrimind.event;

import com.nutrimind.entity.Notificacao;
import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.NotificacaoRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificacaoEventListener {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoEventListener(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPostagemCriada(PostagemCriadaEvent event) {
        Usuario nutri = event.paciente().getNutricionista();
        if (nutri != null) {
            String mensagem = event.paciente().getNome() + " adicionou uma nova refeição.";
            notificacaoRepository.save(new Notificacao(nutri, mensagem, "/postagens/" + event.postagem().getId()));
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onInteracaoCriada(InteracaoCriadaEvent event) {
        // Envia notificação apenas se o autor da interação NÃO for o autor da postagem
        if (!event.postagem().getPaciente().getId().equals(event.autor().getId())) {
            String acao = "CURTIDA".equals(event.tipoInteracao()) ? "curtiu" : "comentou na";
            String mensagem = event.autor().getNome() + " " + acao + " sua publicação.";
            notificacaoRepository.save(new Notificacao(event.postagem().getPaciente(), mensagem, "/postagens/" + event.postagem().getId()));
        }
    }
}
